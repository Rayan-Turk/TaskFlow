using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ProjectDtos;
using api.Models;

namespace api.Mappers
{
    public static class ProjectMappers
    {
        public static ProjectDto ToProjectDto(this Project project)
        {
            return new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                CreatedByUserId = project.CreatedByUserId,
                CreatedAt = project.CreatedAt,
            };
        }

        public static Project FromCreateToProject(this CreateProjectDto createProjectDto)
        {
            return new Project
            {
                Name = createProjectDto.Name,
                Description = createProjectDto.Description,
            };
        }
    }
}
