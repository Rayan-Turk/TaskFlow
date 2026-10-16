using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.ProjectDtos;
using api.Interface;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controller
{
    [ApiController]
    [Route("api/projects")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectRepository _ProjectRepo;

        public ProjectController(IProjectRepository ProjectRepo)
        {
            _ProjectRepo = ProjectRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _ProjectRepo.GetAllAsync();

            var projectsDto = projects.Select(p => p.ToProjectDto());
            return Ok(projectsDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var project = await _ProjectRepo.GetByIdAsync(id);
            if (project == null)
                return NotFound();

            return Ok(project.ToProjectDto());
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectDto createProjectDto)
        {
            // var userExists = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == dto.CreatedByUserId);
            //if (!userExists)
            //  return BadRequest("User does not exist.");
            var projectModel = createProjectDto.FromCreateToProject();
            await _ProjectRepo.CreateAsync(projectModel);

            return CreatedAtAction(
                nameof(GetById),
                new { id = projectModel.Id },
                projectModel.ToProjectDto()
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(
            int id,
            [FromBody] UpdateProjectDto updateProjectDto
        )
        {
            var existingProject = await _ProjectRepo.UpdateAsync(id, updateProjectDto);
            if (existingProject == null)
                return NotFound();

            return Ok(existingProject.ToProjectDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var projectModel = await _ProjectRepo.DeleteAsync(id);
            if (projectModel == null)
                return NotFound();

            return NoContent();
        }
    }
}
