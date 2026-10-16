using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.TaskItemDtos;
using api.Interface;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class TaskRepository : ITaskRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public TaskRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<TaskItem>> GetByProjectIdAsync(int id)
        {
            return await _dbContext.Tasks.Where(t => t.ProjectId == id).ToListAsync();
        }

        public async Task<TaskItem?> GetByIdAsync(int id)
        {
            return await _dbContext.Tasks.FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<TaskItem> CreateAsync(TaskItem task)
        {
            await _dbContext.Tasks.AddAsync(task);
            await _dbContext.SaveChangesAsync();
            return task;
        }

        public async Task<TaskItem?> UpdateAsync(int id, UpdateTaskItemDto updateTaskItemDto)
        {
            var existingTask = await _dbContext.Tasks.FirstOrDefaultAsync(t => t.Id == id);
            if (existingTask == null)
                return null;

            existingTask.Title = updateTaskItemDto.Title;
            existingTask.Description = updateTaskItemDto.Description;
            existingTask.Status = updateTaskItemDto.Status;
            existingTask.Priority = updateTaskItemDto.Priority;
            existingTask.DueDate = updateTaskItemDto.DueDate;

            await _dbContext.SaveChangesAsync();
            return existingTask;
        }

        public async Task<TaskItem?> DeleteAsync(int id)
        {
            var taskModel = await _dbContext.Tasks.FirstOrDefaultAsync(t => t.Id == id);
            if (taskModel == null)
                return null;

            _dbContext.Tasks.Remove(taskModel);
            await _dbContext.SaveChangesAsync();
            return taskModel;
        }
    }
}
