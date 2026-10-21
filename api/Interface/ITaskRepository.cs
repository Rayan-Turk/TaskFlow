using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos;
using api.Dtos.TaskItemDtos;
using api.Models;
using api.Queries;

namespace api.Interface
{
    public interface ITaskRepository
    {
        Task<PagedResultDto<TaskItem>> GetByProjectIdAsync(int projectId, TaskQuery query);
        Task<TaskItem?> GetByIdAsync(int id);
        Task<TaskItem> CreateAsync(TaskItem task);
        Task<TaskItem?> UpdateAsync(int id, UpdateTaskItemDto updateTaskItemDto);
        Task<TaskItem?> DeleteAsync(int id);
    }
}
