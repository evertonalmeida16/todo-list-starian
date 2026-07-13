# Frontend — Starian Checklist

Aplicação Angular 17 (standalone) para gerenciar tarefas via API Laravel.

## Stack

- Angular 17 + TypeScript
- RxJS
- SCSS

## Estrutura

```
src/app/
  todos/
    models/          # contratos tipados
    services/        # acesso HTTP
    todo-list.*      # UI da feature
  app.config.ts      # provideRouter + provideHttpClient
  app.routes.ts
```

## Desenvolvimento

```bash
npm install
npm start
```

A app sobe em `http://localhost:4200` e consome `http://localhost:8000/api/tarefas` (veja `src/environments`).

## Docker

O `docker-compose` monta o código do host e mantém `node_modules` num volume Linux separado (evita conflito de binários nativos Mac vs container).

```bash
docker compose up --build angular
```

## Scripts

| Comando        | Descrição              |
|----------------|------------------------|
| `npm start`    | Dev server             |
| `npm run build`| Build de produção      |
| `npm test`       | Testes unitários (headless) |
| `npm run test:watch` | Testes em modo watch   |

No Docker, o Chromium já vem na imagem (`CHROME_BIN`). Após alterar o Dockerfile:

```bash
docker compose up --build angular
docker compose exec angular npm test
```
