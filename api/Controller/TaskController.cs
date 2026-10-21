using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos;
using api.Dtos.TaskItemDtos;
using api.Interface;
using api.Mappers;
using api.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [Authorize]
    [ApiController]
    [Route("api")]
    public class TaskController : ControllerBase
    {
        private readonly ITaskRepository _taskRepo;

        public TaskController(ITaskRepository taskRepo)
        {
            _taskRepo = taskRepo;
        }

        [HttpGet("projects/{projectId}/tasks")]
        public async Task<IActionResult> GetAll(int projectId, [FromQuery] TaskQuery query)
        {
            var result = await _taskRepo.GetByProjectIdAsync(projectId, query);

            var dto = new PagedResultDto<TaskItemDto>
            {
                Items = result.Items.Select(t => t.ToTaskItemDto()).ToList(),
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = result.TotalCount,
            };

            return Ok(dto);
        }

        [HttpGet("tasks/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var taskModel = await _taskRepo.GetByIdAsync(id);
            if (taskModel == null)
                return NotFound();

            return Ok(taskModel.ToTaskItemDto());
        }

        [HttpPost("tasks")]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskItemDto createTaskItemDto)
        {
            var taskModel = createTaskItemDto.FromCreateToTask();
            await _taskRepo.CreateAsync(taskModel);
            return CreatedAtAction(
                nameof(GetById),
                new { id = taskModel.Id },
                taskModel.ToTaskItemDto()
            );
        }

        [HttpPut("tasks/{id}")]
        public async Task<IActionResult> UpdateTask(
            int id,
            [FromBody] UpdateTaskItemDto updateTaskItemDto
        )
        {
            var existingTask = await _taskRepo.UpdateAsync(id, updateTaskItemDto);
            if (existingTask == null)
                return NotFound();

            return Ok(existingTask.ToTaskItemDto());
        }

        [HttpDelete("tasks/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var taskModel = await _taskRepo.DeleteAsync(id);
            if (taskModel == null)
                return NotFound();

            return NoContent();
        }
    }
}
