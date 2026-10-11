using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public enum TaskStatus
    {
        Todo,
        InProgress,
        Done,
    }

    public enum TaskPriority
    {
        Low,
        Medium,
        High,
    }

    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public TaskStatus Status { get; set; } = TaskStatus.Todo;
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public DateTime DueDate { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;
        public int AssignedToUserId { get; set; }
        public User AssignedToUser { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
