import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { ApiResponse, Person, Skill } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filterOption: 'all' | 'completed' | 'pending' = 'all';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }



  loadTasks(): void {
    this.taskService.getTasks().subscribe((response: ApiResponse) => {
      if (response && response.$values) {
        this.tasks = response.$values.map(task => ({
          id: task.id,
          name: task.name,
          dueDate: new Date(task.dueDate),  
          completed: task.completed,
          persons: task.persons?.$values ? task.persons.$values.map(person => ({
            id: person.id,
            name: person.name,
            age: person.age,
            skills: person.skills?.$values ? person.skills.$values.map(skill => ({
              id: skill.id,
              name: skill.name
            })) : []  
          })) : []  
        }));
      } else {
        console.error('La API no devolvió un array válido:', JSON.stringify(response));
      }
    });
    
  }

  getSkills(person: Person): string {
    return person.skills && person.skills.length > 0 ? person.skills.map(skill => skill.name).join(', ') : 'Sin habilidades';
  }  

  toggleTaskCompletion(task: Task): void {
    task.completed = !task.completed;
    this.taskService.updateTask(task.id!, task).subscribe(() => {
      this.loadTasks();
    });
  }

  filterTasks(): Task[] {
    if (this.filterOption === 'completed') {
      return this.tasks.filter(task => task.completed);
    } else if (this.filterOption === 'pending') {
      return this.tasks.filter(task => !task.completed);
    }
    return this.tasks;
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }
}