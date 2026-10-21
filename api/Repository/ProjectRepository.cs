using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos;
using api.Dtos.ProjectDtos;
using api.Interface;
using api.Models;
using api.Queries;
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

        public async Task<PagedResultDto<Project>> GetAllAsync(ProjectQuery query)
        {
            var projects = _dbContext.Projects.AsQueryable();

            var total = await projects.CountAsync();
            var items = await projects
                .OrderBy(p => p.Id)
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return new PagedResultDto<Project>
            {
                Items = items,
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = total,
            };
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
