using System.Text.Json.Serialization;

namespace ToDoAPI.Models
{
    public class Person
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public List<Skill> Skills { get; set; } = new List<Skill>();
    }
}
