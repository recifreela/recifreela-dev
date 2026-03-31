# Recifreela

Plataforma para conectar **freelancers** e **contratantes** no mercado de trabalho digital, com foco em Recife/PE e no ecossistema do **Porto Digital**.

Objetivo do MVP (16 semanas): publicar job, enviar proposta e fechar um trabalho.

## Stack
- Web: React + Next.js
- API: Node.js (NestJS)
- Banco (início): PostgreSQL local (depois: Vercel Postgres ou Supabase)
- CEP: ViaCEP
- Geocoding: Nominatim (OpenStreetMap) + cache no banco
- Geo queries: PostGIS (recomendado)

## Status do repositório
Este repositório já inclui o **M0 (bootstrap)**: monorepo (web + api), Docker (Postgres), Prisma (schema + migration inicial) e endpoints mínimos. As features do MVP são implementadas via tarefas do [PWD.md](file:///c:/danilo/ReciFreela/PWD.md).

## Como rodar localmente

### Pré-requisitos
- Node.js LTS
- Docker Desktop (recomendado para Postgres local via Docker Compose) ou Postgres instalado localmente

### Docker Desktop (Postgres) — passo a passo
- Instale o Docker Desktop (Windows): https://www.docker.com/products/docker-desktop/
- Abra o Docker Desktop e espere ele ficar “Running”.
- No terminal, na raiz do projeto:
  - `npm run db:up`
- Para confirmar que subiu:
  - Docker Desktop → “Containers” deve mostrar um container `postgres` rodando
  - `docker ps` deve listar o container

### Como ver o banco no seu client SQL (DBeaver/pgAdmin/etc.)
- Host: `localhost`
- Porta: `5432`
- Usuário: `postgres`
- Senha: `postgres`
- Database: `recifreela`

Se o banco não aparecer de primeira, atualize/reconecte no client (o container cria o DB na primeira subida).

### Variáveis de ambiente
- Web: copie [apps/web/.env.example](file:///c:/danilo/ReciFreela/apps/web/.env.example) para `apps/web/.env`
- API: copie [apps/api/.env.example](file:///c:/danilo/ReciFreela/apps/api/.env.example) para `apps/api/.env`

### Comandos
- Instalar dependências: `npm install`
- Subir Postgres (Docker): `npm run db:up`
- Aplicar migrations (Prisma): `npm run db:migrate`
- Seed opcional: `npm run db:seed`
- Rodar web + api: `npm run dev`

### URLs locais
- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- Health check: `GET http://localhost:3001/health`

### Se aparecer “vermelho” no VS Code (Nest/Prisma)
- Garanta que você rodou `npm install` na raiz do projeto.
- Recarregue o TypeScript Server (Command Palette: “TypeScript: Restart TS server”).
- Se for Prisma: rode `npm run db:generate --workspace apps/api` (gera os tipos do Prisma Client).
- Se Docker falhar: confira se o Docker Desktop está rodando e se o “engine” está ativo.

## Branching e merge (padrão do curso)
- `main`: somente releases estáveis
- `develop`: integração contínua do time
- `branch-do-aluno`: cada aluno cria sua branch por tarefa (ex.: `feat/auth-forgot-password`)

### Regras para PR
- PR sempre para `develop`
- Um PR = uma tarefa (pequeno, revisável)
- Checks obrigatórios: lint + typecheck + testes do módulo
- Sem segredos no repo (nunca commitar `.env`)

## Documentos
- Plano macro: [plan.md](file:///c:/danilo/ReciFreela/plan.md)
- PWD (tarefas detalhadas): [PWD.md](file:///c:/danilo/ReciFreela/PWD.md)
