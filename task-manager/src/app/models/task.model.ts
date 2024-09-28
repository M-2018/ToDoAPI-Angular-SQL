export interface Task {
  id?: number;
  name: string;
  dueDate: Date;
  completed?: boolean;
  persons: Person[];
}

export interface Person {
  id?: number;
  name: string;
  age: number;
  skills: Skill[];
}

export interface Skill {
  id?: number;
  name: string;
}

export interface ApiResponse {
  $values: Array<{
    id: number;
    name: string;
    dueDate: string; 
    completed: boolean;
    persons?: {
      $values: Array<{
        id: number;
        name: string;
        age: number;
        skills?: {
          $values: Array<{
            id: number;
            name: string;
          }>;
        };
      }>;
    };
  }>;
}
