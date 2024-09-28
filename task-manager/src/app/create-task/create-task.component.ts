import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent {
  taskForm: FormGroup;
  showPersonError: boolean = false; 
  showNameError: boolean = false;   
  showSkillsError: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      dueDate: ['', [Validators.required, this.dateValidator]],
      persons: this.fb.array([]), 
    });
  }

  dateValidator(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return selectedDate < currentDate ? { invalidDate: true } : null;
  }

  get persons(): FormArray {
    return this.taskForm.get('persons') as FormArray;
  }

  addPerson() {
    const personGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(18)]],
      skills: this.fb.array([]), 
    });
    this.persons.push(personGroup);
  }

  removePerson(index: number) {
    this.persons.removeAt(index);
  }

  getSkills(index: number): FormArray {
    return this.persons.at(index).get('skills') as FormArray;
  }

  addSkill(personIndex: number) {
    this.getSkills(personIndex).push(this.fb.control('', Validators.required));
  }

  removeSkill(personIndex: number, skillIndex: number) {
    this.getSkills(personIndex).removeAt(skillIndex);
  }

  validatePersons(): boolean {
    let valid = true;
    this.showPersonError = false;
    this.showNameError = false;
    this.showSkillsError = false;

    if (this.persons.length === 0) {
      this.showPersonError = true; 
      valid = false;
    }

    const personNames = new Set();

    this.persons.controls.forEach((personGroup, i) => {
      const person = personGroup.value;

      
      if (personNames.has(person.name.trim().toLowerCase())) {
        this.showNameError = true; 
        valid = false;
      } else {
        personNames.add(person.name.trim().toLowerCase());
      }

      
      if (this.getSkills(i).length === 0) {
        this.showSkillsError = true; 
        valid = false;
      }
    });

    return valid;
  }

  onSubmit() {
    if (this.taskForm.valid && this.validatePersons()) {
      const newTask: Task = {
        name: this.taskForm.value.name,
        dueDate: this.taskForm.value.dueDate,
        completed: false,
        persons: this.taskForm.value.persons.map((person: any) => ({
          name: person.name,
          age: person.age,
          skills: person.skills.map((skillName: string) => ({ name: skillName }))
        }))
      };

      console.log('Datos enviados al servidor:', JSON.stringify(newTask, null, 2));

      this.taskService.addTask(newTask).subscribe(
        (response) => {
          console.log('Task created successfully:', response);
          this.taskForm.reset();
          this.router.navigate(['/task-list']);
        },
        (error) => {
          console.error('Error creating task:', error);
        }
      );
    } else {
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
