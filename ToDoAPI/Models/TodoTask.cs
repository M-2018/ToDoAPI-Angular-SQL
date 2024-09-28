using System;

namespace ToDoAPI.Models
{
    public class TodoTask
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime DueDate { get; set; }
        public bool Completed { get; set; }
        public List<Person> Persons { get; set; } = new List<Person>();
    }
}
