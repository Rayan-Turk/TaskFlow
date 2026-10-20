using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.AuthDtos;
using api.Models;

namespace api.Interface
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();
        Task<User?> GetByEmailAsync(string email);
        Task<User> CreateAsync(User user);
    }
}
