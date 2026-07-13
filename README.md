# Starian Checklist

Aplicação fullstack de checklist de tarefas, composta por:

- **Frontend** — Angular 17 (standalone)
- **Backend** — Laravel 11 (API REST + SQLite)

Este repositório foi base de um teste técnico de **refatoração**: o código inicial estava propositalmente mal estruturado; o objetivo foi melhorar organização, legibilidade, manutenibilidade e boas práticas, mantendo o comportamento da aplicação.

---

## Visão geral

| Camada | Tecnologia | URL local |
|--------|------------|-----------|
| UI | Angular 17 + TypeScript + SCSS | http://localhost:4200 |
| API | Laravel 11 + PHP 8.2+ + SQLite | http://localhost:8000 |

O frontend consome `http://localhost:8000/api/tarefas`.

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/tarefas` | Lista tarefas |
| `POST` | `/api/tarefas` | Cria tarefa (`title` obrigatório) |
| `DELETE` | `/api/tarefas/{id}` | Remove tarefa |

Resposta no formato `{ id, title, completed }`.

---

## O que foi refatorado

### Frontend (`frontend/`)

**Antes:** toda a lógica (HTTP, estado e UI) no `AppComponent`, tipagem com `any`, URL da API hardcoded, estilos inline, fallback “offline” com IDs falsos, Docker com conflito de `node_modules` Mac × Linux.

**Depois:**

- Feature isolada em `src/app/todos/` (model tipado, `TodoService`, componente de lista)
- `provideHttpClient()` e `environment` com `apiBaseUrl`
- Estados de loading / erro visíveis (sem dados fake silenciosos)
- Layout responsivo em SCSS
- Testes unitários (Karma + Chrome/Chromium headless)
- Docker com volume dedicado para `node_modules` Linux

Detalhes: [frontend/README.md](frontend/README.md).

### Backend (`backend/`)

**Antes:** lógica em closures em `routes/api.php`, persistência em `storage/tarefas.json`, rotas API misturadas no `web.php`, CORS caseiro aberto (`*`), Docker com paths inconsistentes, sem testes da API.

**Depois:**

- Model Eloquent `Tarefa` + migration SQLite
- `TarefaController`, `StoreTarefaRequest` e `TarefaResource`
- Rotas em `routes/api.php` com prefixo `/api`
- CORS via `config/cors.php` (origem do Angular em `:4200`)
- Feature tests PHPUnit para os endpoints
- Docker alinhado (`/var/www`) + entrypoint (`.env`, migrate, seed)

Detalhes: [backend/README.md](backend/README.md).

---

## Como rodar

### Com Docker (recomendado)

```bash
docker compose up --build
```

- Frontend: http://localhost:4200  
- API: http://localhost:8000  

Na primeira subida o Laravel instala dependências, cria `.env` se necessário, roda migrate e seed.

### Local (sem Docker)

**Backend**

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

**Frontend**

```bash
cd frontend
npm install
npm start
```

---

## Testes

```bash
# Backend
cd backend && php artisan test

# Frontend
cd frontend && npm test
```

No container Angular (Chromium já na imagem):

```bash
docker compose exec angular npm test
```

---

## Estrutura do repositório

```
.
├── backend/          # API Laravel
├── frontend/         # App Angular
├── docker-compose.yml
└── README.md
```
