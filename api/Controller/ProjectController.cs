using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Project;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api/projects")]
    public class ProjectController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public ProjectController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var projects = _dbContext.Projects.ToList();

            var projectDto = projects.Select(p => p.ToProjectDto());
            return Ok(projectDto);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var project = _dbContext.Projects.FirstOrDefault(p => p.Id == id);
            if (project == null)
                return NotFound();

            var projectDto = project.ToProjectDto();
            return Ok(projectDto);
        }

        [HttpPost]
        public IActionResult CreateProject([FromBody] CreateProjectDto createProjectDto)
        {
            var projectModel = createProjectDto.FromCreateToProject();
            _dbContext.Projects.Add(projectModel);
            _dbContext.SaveChanges();

            return CreatedAtAction(
                nameof(GetById),
                new { id = projectModel.Id },
                projectModel.ToProjectDto()
            );
        }

        [HttpPut("{id}")]
        public IActionResult UpdateProject(int id, [FromBody] UpdateProjectDto updateProjectDto)
        {
            var existingProject = _dbContext.Projects.FirstOrDefault(p => p.Id == id);
            if (existingProject == null)
                return NotFound();

            existingProject.Name = updateProjectDto.Name;
            existingProject.Description = updateProjectDto.Description;

            _dbContext.SaveChanges();

            return Ok(existingProject.ToProjectDto());
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProject(int id)
        {
            var projectModel = _dbContext.Projects.FirstOrDefault(p => p.Id == id);
            if (projectModel == null)
                return NotFound();

            _dbContext.Projects.Remove(projectModel);
            _dbContext.SaveChanges();
            return NoContent();
        }
    }
}
