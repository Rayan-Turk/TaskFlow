using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Project;
using api.Interface;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public ProjectRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Project>> GetAllAsync()
        {
            return await _dbContext.Projects.ToListAsync();
        }

        public async Task<Project?> GetByIdAsync(int id)
        {
            return await _dbContext.Projects.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Project> CreateAsync(Project project)
        {
            await _dbContext.Projects.AddAsync(project);
            await _dbContext.SaveChangesAsync();
            return project;
        }

        public async Task<Project?> UpdateAsync(int id, UpdateProjectDto updateProjectDto)
        {
            var existingProject = await _dbContext.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (existingProject == null)
                return null;

            existingProject.Name = updateProjectDto.Name;
            existingProject.Description = updateProjectDto.Description;

            await _dbContext.SaveChangesAsync();
            return existingProject;
        }

        public async Task<Project?> DeleteAsync(int id)
        {
            var projectModel = await _dbContext.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (projectModel == null)
                return null;

            _dbContext.Projects.Remove(projectModel);
            await _dbContext.SaveChangesAsync();
            return projectModel;
        }
    }
}
