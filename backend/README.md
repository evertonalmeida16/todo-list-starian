# Backend — Starian Checklist

API Laravel 11 para gerenciamento de tarefas.

## Stack

- PHP 8.2+ / Laravel 11
- SQLite (padrão local)
- PHPUnit

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/tarefas` | Lista tarefas |
| `POST` | `/api/tarefas` | Cria tarefa (`title` obrigatório) |
| `DELETE` | `/api/tarefas/{id}` | Remove tarefa |

## Desenvolvimento

```bash
cp .env.example .env
composer install
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

API em `http://localhost:8000`.

## Testes

```bash
php artisan test
```

## Docker

```bash
docker compose up --build laravel
```
