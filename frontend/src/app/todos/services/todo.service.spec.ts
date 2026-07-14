import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';
import { Todo } from '../models/todo.model';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/tarefas`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list todos', () => {
    const mockTodos: Todo[] = [
      { id: 1, title: 'Tarefa 1', completed: false },
      { id: 2, title: 'Tarefa 2', completed: false },
    ];

    service.getTodos().subscribe((todos) => {
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });

  it('should create a todo', () => {
    const created: Todo = { id: 3, title: 'Nova', completed: false };

    service.createTodo({ title: 'Nova' }).subscribe((todo) => {
      expect(todo).toEqual(created);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ title: 'Nova' });
    req.flush(created);
  });

  it('should complete todos', () => {
    const completed: Todo[] = [
      { id: 1, title: 'Tarefa 1', completed: true },
      { id: 2, title: 'Tarefa 2', completed: true },
    ];

    service.completeTodos({ ids: [1, 2] }).subscribe((todos) => {
      expect(todos).toEqual(completed);
    });

    const req = httpMock.expectOne(`${apiUrl}/concluir`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ ids: [1, 2] });
    req.flush(completed);
  });

  it('should delete a todo', () => {
    service.deleteTodo(1).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
