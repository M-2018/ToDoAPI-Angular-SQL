using Microsoft.EntityFrameworkCore;
using ToDoAPI.Models;

namespace ToDoAPI.Data
{
    public class ToDoAPIDbContext : DbContext
    {
        public ToDoAPIDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<TodoTask> TodoTasks { get; set; }
        public DbSet<Person> Persons { get; set; }
        public DbSet<Skill> Skills { get; set; }
    }
}
