using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.TaskItemDtos;
using api.Models;

namespace api.Interface
{
    public interface ITaskRepository
    {
        Task<List<TaskItem>> GetByProjectIdAsync(int id);
        Task<TaskItem?> GetByIdAsync(int id);
        Task<TaskItem> CreateAsync(TaskItem task);
        Task<TaskItem?> UpdateAsync(int id, UpdateTaskItemDto updateTaskItemDto);
        Task<TaskItem?> DeleteAsync(int id);
    }
}
