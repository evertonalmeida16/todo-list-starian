import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Todo } from './models/todo.model';
import { TodoService } from './services/todo.service';
import { TodoListComponent } from './todo-list.component';

describe('TodoListComponent', () => {
  let fixture: ComponentFixture<TodoListComponent>;
  let component: TodoListComponent;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;

  const mockTodos: Todo[] = [
    { id: 1, title: 'Tarefa 1', completed: false },
    { id: 2, title: 'Tarefa 2', completed: false },
  ];

  beforeEach(async () => {
    todoServiceSpy = jasmine.createSpyObj('TodoService', [
      'getTodos',
      'createTodo',
      'completeTodos',
      'deleteTodo',
    ]);
    todoServiceSpy.getTodos.and.returnValue(of(mockTodos));

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [{ provide: TodoService, useValue: todoServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
  });

  it('should load todos on init', () => {
    fixture.detectChanges();

    expect(todoServiceSpy.getTodos).toHaveBeenCalled();
    expect(component.todos).toEqual(mockTodos);
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBeNull();
  });

  it('should show an error when loading fails', () => {
    todoServiceSpy.getTodos.and.returnValue(throwError(() => new Error('fail')));

    fixture.detectChanges();

    expect(component.todos).toEqual([]);
    expect(component.errorMessage).toContain('Não foi possível carregar');
  });

  it('should add a todo', () => {
    const created: Todo = { id: 3, title: 'Nova tarefa', completed: false };
    todoServiceSpy.createTodo.and.returnValue(of(created));
    fixture.detectChanges();

    component.newTodoTitle = 'Nova tarefa';
    component.addTodo();

    expect(todoServiceSpy.createTodo).toHaveBeenCalledWith({ title: 'Nova tarefa' });
    expect(component.todos).toContain(created);
    expect(component.newTodoTitle).toBe('');
  });

  it('should complete selected todos and move them to the end', () => {
    const completed: Todo[] = [{ id: 1, title: 'Tarefa 1', completed: true }];
    todoServiceSpy.completeTodos.and.returnValue(of(completed));
    fixture.detectChanges();

    component.toggleSelection(1, true);
    component.completeSelected();

    expect(todoServiceSpy.completeTodos).toHaveBeenCalledWith({ ids: [1] });
    expect(component.todos).toEqual([
      { id: 2, title: 'Tarefa 2', completed: false },
      { id: 1, title: 'Tarefa 1', completed: true },
    ]);
    expect(component.hasSelection).toBeFalse();
    expect(component.completing).toBeFalse();
  });

  it('should keep todos when complete fails', () => {
    todoServiceSpy.completeTodos.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();

    component.toggleSelection(1, true);
    component.completeSelected();

    expect(component.todos.length).toBe(2);
    expect(component.errorMessage).toContain('Não foi possível concluir');
  });

  it('should not remove a todo when the API fails', () => {
    todoServiceSpy.deleteTodo.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();

    component.removeTodo(1);

    expect(component.todos.length).toBe(2);
    expect(component.errorMessage).toContain('Não foi possível remover');
  });
});
