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
  selectedIds = new Set<number>();
  newTodoTitle = '';
  loading = false;
  submitting = false;
  completing = false;
  removingId: number | null = null;
  errorMessage: string | null = null;

  get hasSelection(): boolean {
    return this.selectedIds.size > 0;
  }

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
          this.todos = this.sortTodos(todos);
          this.selectedIds.clear();
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
          this.todos = this.sortTodos([...this.todos, todo]);
          this.newTodoTitle = '';
          this.submitting = false;
        },
        error: () => {
          this.submitting = false;
          this.errorMessage = 'Não foi possível adicionar a tarefa. Tente novamente.';
        },
      });
  }

  toggleSelection(id: number, checked: boolean): void {
    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  onSelectionChange(id: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.toggleSelection(id, input.checked);
  }

  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  completeSelected(): void {
    if (!this.hasSelection || this.completing) {
      return;
    }

    const ids = Array.from(this.selectedIds);
    this.completing = true;
    this.errorMessage = null;

    this.todoService
      .completeTodos({ ids })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (completedTodos) => {
          const completedById = new Map(
            completedTodos.map((todo) => [todo.id, todo])
          );

          this.todos = this.sortTodos(
            this.todos.map((todo) => completedById.get(todo.id) ?? todo)
          );
          this.selectedIds.clear();
          this.completing = false;
        },
        error: () => {
          this.completing = false;
          this.errorMessage =
            'Não foi possível concluir as tarefas selecionadas. Tente novamente.';
        },
      });
  }

  private sortTodos(todos: Todo[]): Todo[] {
    return [...todos].sort((a, b) => {
      if (a.completed === b.completed) {
        return a.id - b.id;
      }
      return Number(a.completed) - Number(b.completed);
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
          this.selectedIds.delete(id);
          this.removingId = null;
        },
        error: () => {
          this.removingId = null;
          this.errorMessage = 'Não foi possível remover a tarefa. Tente novamente.';
        },
      });
  }
}
