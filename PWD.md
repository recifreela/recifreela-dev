# PWD — Recifreela (Product Work Document)

## Objetivo do PWD

Dividir o sistema em partes macro e em **tarefas pequenas**, com **checks objetivos** para os alunos implementarem e validarem via PR em `develop`.

## Contexto (Porto Digital / ensino em equipe)

- Projeto didático em parceria com o ecossistema do Porto Digital para ensinar:
  - trabalho em equipe (branches pequenas, PR review, integração em `develop`)
  - entrega incremental (MVP em 16 semanas)
  - arquitetura fullstack (Next.js + NestJS + Postgres)
- Regra de ouro do MVP
  - não é fazer um marketplace completo
  - publicar job, enviar proposta e fechar trabalho = sucesso operacional

## Arquitetura (decisão do curso)

- Monorepo:
  - `apps/web` (Next.js)
  - `apps/api` (NestJS)
  - `packages/*` (tipos compartilhados, validação, UI, etc. — se fizer sentido)
- Comunicação: Web consome API via HTTP (REST), com autenticação via cookies HTTP-only (recomendado) ou Authorization Bearer.

## Cronograma (16 semanas)

- Fase 1 (Semanas 1–2): requisitos, escopo do MVP, papéis, criação do board (Trello)
- Fase 2 (Semanas 3–4): UX (wireframes, jornada) + arquitetura (modelagem, bootstrap)
- Fase 3 (Semanas 5–10): desenvolvimento core (auth/usuários, jobs, propostas)
- Fase 4 (Semanas 11–13): integração, testes e correções
- Fase 5 (Semanas 14–16): validação com usuários, ajustes finais e apresentação

## Regras de papéis (roles)

- `user-freela`
- `user-empresa`

Cada usuário tem **exatamente 1 role** e **exatamente 1 perfil do seu tipo** (1–1).

## Modelo de dados (para orientar relacionamentos)

### Entidades e relacionamentos

- `users` (base)
  - 1–N `job_posts` (jobs/projetos)
- `empresa_profiles`
  - 1–N `job_posts`
- `job_posts` ↔ `freela_profiles`
  - N–N via `job_proposals` (propostas)

### Campos mínimos sugeridos

- `users`: `email`, `password_hash`, `role`, `status`
- `freela_profiles`: `cpf` (único), `nome`, `bio`, `disponivel` (boolean), `nivel`
- `empresa_profiles`: `cnpj` (único), `razao_social`, `nome_fantasia`, `sobre`
- `addresses`: `cep`, `logradouro`, `numero`, `bairro`, `cidade`, `uf`, `lat`, `lng`, `geog_point`
- `job_posts`: `titulo`, `descricao`, `prazo`, `orcamento_min`, `orcamento_max`, `modelo_trabalho`, `status`
- `service_posts`: `titulo`, `descricao`, `status`
- `job_proposals`: `mensagem`, `valor_proposto`, `prazo_proposto`, `status`

Observação: CPF/CNPJ devem ser armazenados **normalizados** (somente dígitos). Senha nunca é armazenada em texto puro.

## Milestones e tarefas (com checks)

### M0 — Bootstrap (repo e qualidade)

Objetivo do M0: deixar o repositório pronto para qualquer aluno clonar, configurar o banco em minutos e começar o M1 (autenticação) sem travar no setup.

**T0.1 — Estrutura do monorepo**

- Checks
  - existem `apps/web` (Next.js) e `apps/api` (NestJS)
  - scripts raiz para rodar tudo: `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run test`

**T0.2 — Convenções de pastas e nomes**

- Checks
  - `apps/api` expõe API em `http://localhost:3001`
  - `apps/web` roda em `http://localhost:3000`
  - `apps/web` lê `NEXT_PUBLIC_API_URL`
  - `apps/api` lê `DATABASE_URL`

**T0.3 — Docker Compose (Postgres)**

- Checks
  - existe `docker-compose.yml` na raiz
  - serviço Postgres sobe com volume persistente
  - porta padrão local definida (ex.: 5432)
  - credenciais padrão definidas (dev only)

**T0.4 — ORM e migrations (Prisma recomendado)**

- Checks
  - Prisma instalado e configurado no `apps/api`
  - existe `schema.prisma` versionado
  - existe comando de migration (ex.: `npm run db:migrate --workspace apps/api`)
  - ao rodar migration com Postgres local, tabelas iniciais são criadas

**T0.5 — Schema inicial (tabelas mínimas)**

- Checks
  - `users` (email, password_hash, role)
  - `freela_profiles` e `empresa_profiles` (relacionamento 1–1 com `users`)
  - `password_reset_tokens` (esqueci senha)
  - `job_posts` e `job_proposals` (base do MVP)

**T0.6 — Seed mínimo (opcional, mas recomendado)**

- Checks
  - existe comando `db:seed`
  - seed cria 1 freela e 1 contratante (com perfis) e 1 job aberto

**T0.7 — Endpoints de verificação**

- Checks
  - `GET /health` retorna 200 e um payload simples
  - `GET /` no web carrega e mostra links para Login/Cadastro

**T0.8 — .env examples (sem segredos)**

- Checks
  - existe `.env.example` (ou `apps/*/.env.example`) com variáveis necessárias
  - `README.md` explica como copiar e preencher `.env`

**T0.9 — Qualidade e CI**

- Checks
  - lint e typecheck configurados em web e api
  - pipeline (GitHub Actions) roda `lint`, `typecheck`, `test` em PR para `develop`
  - regra sugerida: PR só entra em `develop` com checks verdes

### M1 — Autenticação + cadastro base (com esqueci senha)

**T1.1 — Cadastro (freela e empresa)**

- Checks
  - endpoint `POST /auth/register` aceita role + dados mínimos do perfil do tipo + endereço
  - validações: e-mail único; CPF/CNPJ único; role obrigatória
  - cria `users` + `freela_profiles` OU `empresa_profiles` no mesmo fluxo (transação)
  - cria `addresses` associado ao usuário (mínimo: `cep`, `cidade`, `uf`, `bairro`, `logradouro`, `numero`)
  - normaliza CPF/CNPJ (somente dígitos) e e-mail (lowercase)

**T1.2 — Login e sessão**

- Checks
  - endpoint `POST /auth/login` valida credenciais
  - tokens (access/refresh) ou sessão são persistidos com segurança (cookie HTTP-only recomendado)
  - `GET /me` retorna usuário + role para o frontend montar menu por role

**T1.3 — Logout**

- Checks
  - endpoint invalida refresh token (ou remove cookie/sessão)
  - usuário não consegue acessar rotas protegidas após logout

**T1.4 — Esqueci senha**

- Checks
  - `POST /auth/forgot-password` gera token com expiração
  - token não é armazenado em texto puro (hash)
  - e-mail é disparado (local: provider dev; prod: provider real)

**T1.5 — Reset de senha**

- Checks
  - `POST /auth/reset-password` valida token, expiração e uso único
  - senha nova é salva com hash
  - token fica marcado como utilizado

**T1.6 — Autorização por role**

- Checks
  - rotas de empresa bloqueiam freelas e vice-versa
  - testes cobrindo pelo menos 1 caso permitido e 1 negado

### M2 — Endereço + geolocalização (distância em modo presencial)

Objetivo do M2: quando um job for `PRESENCIAL`, mostrar a distância aproximada entre freela ↔ empresa nos feeds de busca (para ambos os lados), usando endereço + geocode.

**T2.1 — Completar perfil do Freela**

- Checks
  - form web para editar `nome`, `bio`, `nivel`, `disponivel`
  - API valida payload e atualiza somente o perfil do usuário logado

**T2.2 — Completar perfil da Empresa**

- Checks
  - form web para editar `razao_social`, `nome_fantasia`, `sobre`, `site_url`
  - API valida payload e atualiza somente o perfil do usuário logado

**T2.3 — Integração com ViaCEP**

- Checks
  - no frontend, ao digitar CEP, busca no ViaCEP e preenche endereço
  - valida CEP inválido/ausente com mensagem amigável

**T2.4 — Geocoding e persistência de lat/lng**

- Checks
  - ao salvar endereço, API chama geocoding (Nominatim) e grava `lat/lng`
  - cache: reusar geocode se endereço não mudou
  - se geocoding falhar, sistema continua funcionando (sem distância), mas registra estado no banco

**T2.5 — Distância no feed (presencial)**

- Checks
  - feed de jobs inclui `distance_km` quando:
    - usuário logado é freela, tem `lat/lng` no seu endereço e
    - job tem `modelo_trabalho = PRESENCIAL` e a empresa tem `lat/lng`
  - feed de freelas (visão empresa) inclui `distance_km` quando:
    - empresa logada tem `lat/lng` e
    - freela listado tem `lat/lng`
  - filtros por distância:
    - `raio_km` limita resultados quando houver `lat/lng` disponível
  - se algum lado não tiver `lat/lng`, retornar sem distância e sem filtrar por raio

**T2.6 — Links sociais e currículo (freela)**

- Checks
  - campos `linkedin_url`, `github_url` no perfil
  - upload de currículo PDF com limite de tamanho
  - armazenamento em nuvem com URL acessível por empresa
  - versão e data de upload registradas

**T2.7 — Perfil da empresa (descrição completa)**

- Checks
  - campos `sobre` e `site_url` obrigatórios para perfil publicado
  - validação de URL

### M3 — Descoberta (jobs e freelas)

**T3.1 — CRUD de jobs/projetos (contratante)**

- Checks
  - contratante cria/edita/lista/arquiva job
  - job só pode ser editado pelo dono
  - status inicial do job é `ABERTO`

**T3.2 — Feed público de jobs**

- Checks
  - listagem pública paginada
  - filtros: keyword, stack/tags, modelo de trabalho, orçamento, prazo, status
  - se `PRESENCIAL`, permitir ordenar por distância (quando possível)

**T3.3 — Perfil público de freela + portfólio (opcional)**

- Checks
  - perfil do freela exibe bio, stacks, disponibilidade, links e currículo (se existir)
  - CRUD de serviços/portfolio (se adotado)

**T3.4 — Feed de freelas (empresa)**

- Checks
  - listagem paginada de freelas
  - filtros: keyword, stack/tags, senioridade/nível, disponibilidade, cidade/UF, raio_km, tem LinkedIn/GitHub
  - empresa consegue abrir perfil e visualizar currículo

**T3.5 — Navegação e menus por role**

- Checks
  - sidebar do freela contém: Feed de Jobs, Minhas Propostas, Meu Perfil, Notificações, Configurações
  - sidebar da empresa contém: Feed de Freelas, Meus Jobs, Propostas por Job, Recrutadores (opcional), Perfil da Empresa, Notificações, Configurações
  - cada item navega para a tela correta com proteção por role

**T3.6 — Filtros detalhados (jobs e freelas)**

- Checks
  - Jobs: keyword, stack/tags, modelo, orçamento, prazo, status, cidade/UF, raio_km, ordenação
  - Freelas: keyword, stack/tags, senioridade/nível, disponibilidade, cidade/UF, raio_km, possui LinkedIn/GitHub
  - filtros persistem na URL (query string)

### M4 — Propostas + status do job + notificações

**T4.1 — Envio de proposta (freela)**

- Checks
  - `POST /jobs/:id/proposals` cria proposta (idempotente via unique index)
  - status inicial `ENVIADA`
  - bloqueia proposta se job não estiver `ABERTO`

**T4.2 — Gestão de propostas (contratante)**

- Checks
  - contratante lista propostas por job
  - contratante aceita/recusa proposta
  - auditoria mínima (timestamps)

**T4.3 — Status do job (aberto → em andamento → concluído)**

- Checks
  - aceitar uma proposta pode marcar job como `EM_ANDAMENTO`
  - marcar job como `CONCLUIDO` só quando `EM_ANDAMENTO`
  - bloquear envio de novas propostas se job não estiver `ABERTO`

**T4.4 — Notificações in-app**

- Checks
  - cria notificação em eventos: nova proposta, proposta aceita/recusada, job concluído
  - tela de notificações com marcar como lida

**T4.5 — Notificações por e-mail (eventos críticos)**

- Checks
  - e-mail enviado em: esqueci senha, proposta aceita/recusada (mínimo)
  - provider dev para ambiente local

**T4.6 — Pipeline (estágios) (opcional)**

- Checks
  - `stage`: TRIAGEM, TESTE_TECNICO, ENTREVISTA_TECNICA, ENTREVISTA_RH, OFERTA
  - `outcome`: PENDENTE, APROVADA, RECUSADA, CANCELADA
  - mudança de estágio/outcome gera histórico com usuário responsável
  - Kanban por job com contadores por estágio

**T4.7 — Membros (recrutadores) da empresa (opcional)**

- Checks
  - endpoints para criar/listar/remover membros: OWNER/RECRUITER
  - permissão RECRUITER consegue gerir jobs/propostas
  - dashboard com métricas simples: entrevistas realizadas, pipelines ativos

### M5 — Avaliação (se der tempo)

**T5.1 — Avaliação freelancer ↔ contratante**

- Checks
  - após job `CONCLUIDO`, ambos podem avaliar (nota e feedback)
  - média calculada e exibida no perfil
  - bloquear avaliações duplicadas para o mesmo job

## UX e padrão de qualidade (aplica em todas as tasks)

**Checklist obrigatório por PR**

- Tela tem loading, empty state e tratamento de erro
- Validações no frontend + backend (nunca confiar só no frontend)
- Acessibilidade mínima: labels, foco, contraste aceitável
- Rodar `lint`, `typecheck`, `test` antes do PR

## Fluxo de trabalho (main / develop / branch-do-aluno)

1. Aluno cria branch a partir de `develop`
2. Implementa uma única task (ex.: `T1.4`)
3. Abre PR para `develop` com descrição + prints (quando for UI)
4. Checks automáticos precisam passar
5. Review + merge em `develop`
6. Periodicamente, `develop` é mergeado em `main` (release)
