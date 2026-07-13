import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { Todo } from './models/todo.model';
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  private readonly destroyRef = inject(DestroyRef);

  todos: Todo[] = [];
  newTodoTitle = '';
  loading = false;
  submitting = false;
  removingId: number | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    this.errorMessage = null;

    this.todoService
      .getTodos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (todos) => {
          this.todos = todos;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage =
            'Não foi possível carregar as tarefas. Verifique se a API está disponível.';
        },
      });
  }

  addTodo(): void {
    const title = this.newTodoTitle.trim();
    if (!title || this.submitting) {
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    this.todoService
      .createTodo({ title })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (todo) => {
          this.todos = [...this.todos, todo];
          this.newTodoTitle = '';
          this.submitting = false;
        },
        error: () => {
          this.submitting = false;
          this.errorMessage = 'Não foi possível adicionar a tarefa. Tente novamente.';
        },
      });
  }

  removeTodo(id: number): void {
    if (this.removingId !== null) {
      return;
    }

    this.removingId = id;
    this.errorMessage = null;

    this.todoService
      .deleteTodo(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.todos = this.todos.filter((todo) => todo.id !== id);
          this.removingId = null;
        },
        error: () => {
          this.removingId = null;
          this.errorMessage = 'Não foi possível remover a tarefa. Tente novamente.';
        },
      });
  }

}
