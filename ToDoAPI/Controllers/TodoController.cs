using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoAPI.Data;
using ToDoAPI.Models;

namespace ToDoAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly ToDoAPIDbContext _context;

        public TodoController(ToDoAPIDbContext context)
        {
            _context = context;
        }

        // GET: api/todo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoTask>>> GetTasks()
        {
            var tasks = await _context.TodoTasks
                .Include(t => t.Persons)
                    .ThenInclude(p => p.Skills)
                .ToListAsync();
            return Ok(tasks);
        }

        // GET: api/todo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoTask>> GetTask(int id)
        {
            var task = await _context.TodoTasks
                .Include(t => t.Persons)
                    .ThenInclude(p => p.Skills)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        [HttpPost]
        public async Task<ActionResult<TodoTask>> CreateTask(TodoTask task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.TodoTasks.Add(task);
                foreach (var person in task.Persons)
                {
                    _context.Persons.Add(person);
                    foreach (var skill in person.Skills)
                    {
                        _context.Skills.Add(skill);
                    }
                }

                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
            }
            catch (Exception ex)
            {
               // _logger.LogError(ex, "Error creating task");
                return StatusCode(500, "An error occurred while creating the task");
            }
        }


        // PUT: api/todo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TodoTask task)
        {
            if (id != task.Id)
            {
                return BadRequest();
            }

            _context.Entry(task).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/todo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.TodoTasks
                .Include(t => t.Persons)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null)
            {
                return NotFound();
            }

            _context.TodoTasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Método para comprobar si una tarea existe
        private bool TaskExists(int id)
        {
            return _context.TodoTasks.Any(t => t.Id == id);
        }
    }
}
