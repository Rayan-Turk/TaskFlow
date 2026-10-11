using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public enum UserRole
    {
        Admin,
        Member,
    }

    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.Member;
        public List<Project> CreatedProjects { get; set; } = [];
        public List<TaskItem> AssignedTasks { get; set; } = [];
    }
}
