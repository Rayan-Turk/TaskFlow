using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Project;
using api.Models;

namespace api.Interface
{
    public interface IProjectRepository
    {
        Task<List<Project>> GetAllAsync();
        Task<Project?> GetByIdAsync(int id);
        Task<Project> CreateAsync(Project projectModel);
        Task<Project?> UpdateAsync(int id, UpdateProjectDto updateProjectDto);
        Task<Project?> DeleteAsync(int id);
    }
}
