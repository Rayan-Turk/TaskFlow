using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.TaskItemDtos;
using api.Models;

namespace api.Mappers
{
    public static class TaskMappers
    {
        public static TaskItemDto ToTaskItemDto(this TaskItem taskItem)
        {
            return new TaskItemDto
            {
                Id = taskItem.Id,
                Title = taskItem.Title,
                Description = taskItem.Description,
                Status = taskItem.Status,
                Priority = taskItem.Priority,
                DueDate = taskItem.DueDate,
                ProjectId = taskItem.ProjectId,
                AssignedToUserId = taskItem.AssignedToUserId,
                CreatedAt = taskItem.CreatedAt,
            };
        }

        public static TaskItem FromCreateToTask(this CreateTaskItemDto createTaskItemDto)
        {
            return new TaskItem
            {
                Title = createTaskItemDto.Title,
                Description = createTaskItemDto.Description,
                Status = createTaskItemDto.Status,
                Priority = createTaskItemDto.Priority,
                DueDate = createTaskItemDto.DueDate,
                ProjectId = createTaskItemDto.ProjectId,
                AssignedToUserId = createTaskItemDto.AssignedToUserId,
            };
        }
    }
}
