using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Queries
{
    public class TaskQuery
    {
        public TaskItemStatus? Status { get; set; }
        public TaskPriority? Priority { get; set; }
        public int? AssigneeId { get; set; }

        [Range(1, int.MaxValue)]
        public int Page { get; set; } = 1;

        [Range(1, 50)]
        public int PageSize { get; set; } = 10;
    }
}
