using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos;
using api.Dtos.ProjectDtos;
using api.Models;
using api.Queries;

namespace api.Interface
{
    public interface IProjectRepository
    {
        Task<PagedResultDto<Project>> GetAllAsync(ProjectQuery query);
        Task<Project?> GetByIdAsync(int id);
        Task<Project> CreateAsync(Project projectModel);
        Task<Project?> UpdateAsync(int id, UpdateProjectDto updateProjectDto);
        Task<Project?> DeleteAsync(int id);
    }
}
