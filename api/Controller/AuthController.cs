using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.AuthDtos;
using api.Interface;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly ITokenService _tokenService;
        private readonly PasswordHasher<User> _passwordHasher = new();

        public AuthController(IUserRepository userRepo, ITokenService tokenService)
        {
            _userRepo = userRepo;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var existingUser = await _userRepo.GetByEmailAsync(registerDto.Email);
            if (existingUser != null)
                return Conflict("Email already in use");

            var user = new User { FullName = registerDto.FullName, Email = registerDto.Email };

            user.PasswordHash = _passwordHasher.HashPassword(user, registerDto.Password);
            await _userRepo.CreateAsync(user);

            return Ok(
                new AuthResponseDto
                {
                    Token = _tokenService.CreateToken(user),
                    FullName = user.FullName,
                    Role = user.Role.ToString(),
                }
            );
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var existingUser = await _userRepo.GetByEmailAsync(loginDto.Email);
            if (existingUser == null)
                return Unauthorized("Invalid email or password.");

            var result = _passwordHasher.VerifyHashedPassword(
                existingUser,
                existingUser.PasswordHash,
                loginDto.Password
            );
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid email or password.");

            return Ok(
                new AuthResponseDto
                {
                    Token = _tokenService.CreateToken(existingUser),
                    FullName = existingUser.FullName,
                    Role = existingUser.Role.ToString(),
                }
            );
        }
    }
}
