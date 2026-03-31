# Recifreela — Plano Inicial (para revisão)

## Visão

O Recifreela é uma plataforma digital que conecta **freelancers** a **contratantes** no mercado de trabalho digital, com foco inicial na cidade de Recife/PE, especialmente no ecossistema do **Porto Digital**.

A proposta é reduzir fricção na contratação de serviços digitais locais e ativar economicamente talentos da região.

## Objetivo (MVP)

Entregar uma plataforma web funcional em 16 semanas onde o usuário consegue:

- Contratante publica um job/projeto (escopo, prazo e orçamento)
- Freela visualiza jobs disponíveis e envia proposta
- Contratante aceita/recusa propostas
- Job evolui de status (aberto → em andamento → concluído)

Regra de ouro: não é fazer um Workana 2.0. Se publicar job, enviar proposta e fechar um trabalho, já é sucesso operacional.

## Público-alvo

- Contratantes: startups, empresas locais, agências, profissionais liberais, projetos do ecossistema
- Freelancers: devs, designers, social media, tráfego pago, vídeo, profissionais digitais em geral

## Stack proposta (alunos implementam)

- Frontend: **React + Next.js** (App Router)
- Backend: **Node.js** com **NestJS** (API REST)
- Banco (início): **PostgreSQL** local; depois migra para **Vercel Postgres** ou **Supabase**
- Geolocalização: **PostgreSQL + PostGIS** (recomendado) para distância/raio
- CEP: **ViaCEP**
- Geocoding (CEP → lat/lng): **Nominatim (OpenStreetMap)** (sem chave) + cache no banco

## Macro-módulos do produto

1. Usuários (cadastro/login, roles e perfil básico)
2. Freelancers (perfil completo, portfólio, habilidades, currículo e disponibilidade)
3. Contratantes (perfil completo, publicação e gestão de jobs/projetos)
4. Propostas (envio, aceite/recusa e histórico)
5. Status do job (aberto, em andamento, concluído)
6. Descoberta (feeds e busca com filtros)
7. Localização (CEP + geolocalização para oportunidades presenciais)
8. Notificações (in-app + e-mail para eventos críticos)
9. Avaliações (se der tempo)

## Regras de negócio-chave

- Usuário tem **uma role**: `user-freela` ou `user-empresa`
- Cada usuário tem **um perfil 1–1** do seu tipo
- Contratante publica **N jobs** (1–N)
- Um job recebe **N propostas**; freela pode enviar propostas em **N jobs** (N–N via tabela de propostas)
- Job tem status do ciclo de vida: `ABERTO` → `EM_ANDAMENTO` → `CONCLUIDO` (e `CANCELADO` se necessário)
- Freela tem campo `disponivel` (boolean) para aceitar novos trabalhos
- Para modelo presencial, exibir **distância aproximada** entre freela e contratante (ou job)

## Modelo de dados (rascunho)

### Tabelas principais

- `users`
  - `id`, `email` (único), `password_hash`, `role`, `status`, `created_at`
- `password_reset_tokens`
  - `id`, `user_id`, `token_hash`, `expires_at`, `used_at`
- `freela_profiles` (1–1 com `users`)
  - `user_id` (PK/FK), `nome`, `cpf` (único), `bio`, `disponivel` (bool), `nivel`, `avatar_url`, `linkedin_url`, `github_url`
- `empresa_profiles` (1–1 com `users`)
  - `user_id` (PK/FK), `razao_social`, `nome_fantasia`, `cnpj` (único), `sobre`, `logo_url`, `site_url`
- `addresses` (1–1 por perfil, no início)
  - `id`, `owner_type` (`FREELA`|`EMPRESA`), `owner_user_id`, `cep`, `logradouro`, `numero`, `bairro`, `cidade`, `uf`, `complemento`
  - `lat`, `lng`, `geog_point` (PostGIS), `geocoded_at`
- `job_posts` (jobs/projetos do contratante)
  - `id`, `empresa_user_id` (FK), `titulo`, `descricao`, `prazo`, `orcamento_min`, `orcamento_max`, `modelo_trabalho` (REMOTO/HIBRIDO/PRESENCIAL), `status` (ABERTO/EM_ANDAMENTO/CONCLUIDO/CANCELADO), `created_at`
  - opcional: `lat/lng` se o job tiver local diferente da empresa
- `job_proposals` (propostas do freela)
  - `id`, `job_post_id` (FK), `freela_user_id` (FK)
  - `mensagem`, `valor_proposto`, `prazo_proposto`, `status` (ENVIADA/ACEITA/RECUSADA/CANCELADA), `created_at`
  - índice único (`job_post_id`, `freela_user_id`)
- `freela_resumes` (currículos)
  - `id`, `freela_user_id` (FK), `file_key`, `file_name`, `mime_type`, `file_size`, `uploaded_at`
- `service_posts` (serviços/portfolio do freela - opcional no MVP)
  - `id`, `freela_user_id` (FK), `titulo`, `descricao`, `stack_tags[]` (ou tabela N–N), `status`, `created_at`
- `notifications`
  - `id`, `user_id`, `type`, `payload_json`, `read_at`, `created_at`
- `company_members` (multi-recrutadores - fase 2 do MVP)
  - `id`, `company_user_id` (FK), `member_user_id` (FK), `permission` (OWNER/RECRUITER), `created_at`

### Relações (para os alunos visualizarem)

- `users` 1–1 `freela_profiles` (somente quando `role = user-freela`)
- `users` 1–1 `empresa_profiles` (somente quando `role = user-empresa`)
- `empresa_profiles` 1–N `job_posts`
- `job_posts` N–N `freela_profiles` via `job_proposals`
- `freela_profiles` 1–N `freela_resumes`
- `empresa_profiles` N–N `users` (membros/recrutadores) via `company_members` (opcional)

## API (rascunho de rotas)

- Auth
  - `POST /auth/register` (freela/empresa)
  - `POST /auth/login`
  - `POST /auth/logout`
  - `POST /auth/forgot-password`
  - `POST /auth/reset-password`
- Perfil
  - `GET /me`
  - `PUT /me/profile` (atualiza perfil do tipo do usuário)
  - `PUT /me/address` (usa ViaCEP + geocoding)
- Feed
  - `GET /feed/jobs`
  - `GET /feed/services`
- Empresa
  - `POST /company/jobs`
  - `PUT /company/jobs/:id`
  - `GET /company/jobs`
- Freela
  - `POST /freela/services`
  - `PUT /freela/services/:id`
  - `GET /freela/services`
- Propostas
  - `POST /jobs/:id/proposals`
  - `GET /jobs/:id/proposals` (empresa)
  - `GET /me/proposals` (freela)
  - `PUT /company/proposals/:id/status` (aceitar/recusar)
  - `PUT /company/jobs/:id/status` (aberto/em andamento/concluído)

## Cronograma (16 semanas — modelo Embarque Digital)

- Fase 1 (Semanas 1–2): Imersão e definição (requisitos, escopo do MVP, papéis, board)
- Fase 2 (Semanas 3–4): UX + arquitetura (wireframes, jornada, modelagem do banco, bootstrap)
- Fase 3 (Semanas 5–10): Desenvolvimento core (auth/usuários, jobs, propostas)
- Fase 4 (Semanas 11–13): Integração e testes (front+back, correções, ajustes UX)
- Fase 5 (Semanas 14–16): Validação e entrega (MVP online, testes com usuários reais, apresentação)

## Milestones (M0 → M4)

### M0 — Bootstrap do repositório

- Definir monorepo (web + api) e scripts padrão (dev/lint/typecheck/test)
- Configurar Docker Compose (Postgres) e migrações/ORM
- CI simples (rodar lint + typecheck + test)

### M1 — Autenticação completa

- Cadastro (freela/empresa), login/logout, refresh token
- Esqueci senha e reset
- Guards/roles no backend + proteção de rotas no frontend

### M2 — Perfis + endereço + geolocalização

- Formulários completos (CPF/CNPJ com validação)
- Integração ViaCEP e persistência de endereço
- Geocoding e cálculo de distância (quando aplicável)

### M3 — Descoberta (jobs e freelas)

- CRUD de jobs/projetos (contratante)
- Perfil público de freelas (com filtros)
- Feed público com filtros (keyword, orçamento, prazo, modelo de trabalho, distância quando presencial)

### M4 — Propostas + status do job + notificações

- Freela envia proposta
- Contratante aceita/recusa
- Job muda de status (aberto/em andamento/concluído)
- Notificações in-app e por e-mail (eventos principais)

## Modelo de gestão (time e ferramentas)

- Ferramentas: Trello (tarefas), GitHub (código), Discord/WhatsApp (comunicação)
- Ritual semanal (30 min): revisão do entregue, bloqueios, planejamento da semana
- PR pequeno por tarefa, merge em `develop` com checks verdes

## Papéis no projeto (exemplo do curso)

- Erik: Product Owner (visão e decisão)
- Danilo: líder técnico (padrões, arquitetura e revisão)
- Squad Embarque Digital: desenvolvimento
- Mentor: orientação técnica e validação

## Critérios de aceite globais

- Segurança: senha sempre hash; tokens com expiração; validação de entrada; rate limit em auth
- UX: loading, estados vazios, erros amigáveis, responsivo
- Qualidade: lint + typecheck + testes mínimos por módulo
- Git flow: PRs para `develop`, e `develop` mergeado em `main` somente com checks verdes

## Navegação por role (fluxos e menus)

- Freelas
  - Sidebar
    - Feed de Jobs
    - Minhas Propostas
    - Meus Serviços
    - Meu Perfil
    - Notificações
    - Configurações
  - Fluxos principais
    - Descobrir jobs (aplicar filtros, visualizar detalhes, enviar proposta)
    - Enviar propostas e acompanhar status (aceita/recusada/pendente)
    - Ofertar serviços (CRUD)
    - Completar perfil com links (LinkedIn/GitHub) e currículo
    - Ajustar disponibilidade
- Empresas
  - Sidebar
    - Feed de Freelas
    - Minhas Vagas
    - Propostas por Job
    - Recrutadores (gerenciar membros)
    - Perfil da Empresa
    - Notificações
    - Configurações
  - Fluxos principais
    - Publicar jobs (CRUD, arquivar)
    - Descobrir freelas (filtros, visualizar perfil e currículo)
    - Gerir propostas (aceitar/recusar) e acompanhar jobs em andamento/concluídos
    - Convidar/cadastrar recrutadores e ver métricas
    - Completar perfil da empresa (site, descrição)

## Filtros detalhados (busca de jobs e freelas)

- Jobs (vagas)
  - Palavras-chave
  - Stack/tags
  - Modelo de trabalho (REMOTO/HÍBRIDO/PRESENCIAL)
  - Orçamento (min/max)
  - Prazo (faixa de datas ou “até X dias”)
  - Status (ABERTO/EM_ANDAMENTO/CONCLUIDO)
  - Cidade/UF
  - Raio em km (quando presencial)
  - Ordenação por distância (quando aplicável) ou mais recentes
- Freelas
  - Palavras-chave
  - Stack/tags
  - Senioridade/nível
  - Disponibilidade (disponível/não)
  - Cidade/UF
  - Raio em km
  - Tem LinkedIn/GitHub

## Upload e armazenamento de currículo (freela)

- Upload de PDF (tamanho máximo, ex.: 5–10 MB)
- Armazenamento em nuvem (ex.: Supabase Storage ou S3)
- Link privado acessível para membros da empresa
- Metadados: versão, data de upload
- Anti-malware opcional no futuro

## Links sociais e descrição

- Freela: `linkedin_url`, `github_url`
- Empresa: `site_url`, `sobre` (descrição)

## Empresa com múltiplos recrutadores

- Modelagem
  - `company_members`
    - `id`, `company_user_id` (FK → `users` com role `user-empresa`), `member_user_id` (FK → `users`), `permission` (`OWNER`|`RECRUITER`), `created_at`
    - índice único (`company_user_id`, `member_user_id`)
  - Métricas (podem ser derivadas, ou armazenadas em tabela agregada)
    - entrevistas realizadas, pipelines ativos, última atividade
- Permissões
  - OWNER: tudo
  - RECRUITER: gerir jobs e propostas da empresa

## Propostas: status e pipeline (opcional)

- Campos
  - `job_proposals.status`: `ENVIADA` | `ACEITA` | `RECUSADA` | `CANCELADA`
  - `job_posts.status`: `ABERTO` | `EM_ANDAMENTO` | `CONCLUIDO` | `CANCELADO`
  - `job_proposals.stage` (opcional): `TRIAGEM` | `TESTE_TECNICO` | `ENTREVISTA` | `OFERTA`
- Histórico (opcional)
  - `proposal_status_history`: `id`, `proposal_id`, `from`, `to`, `changed_by_user_id`, `note`, `created_at`
- Dashboards
  - Contadores por job: propostas pendentes, aceitas, recusadas
  - Visão Kanban por estágio (se adotado)

## API complementares

- Recrutadores
  - `POST /company/members` (convidar/cadastrar)
  - `GET /company/members`
  - `DELETE /company/members/:id`
- Currículo
  - `POST /freela/curriculo` (upload assinado)
  - `GET /freela/curriculo` (listar versões)
  - `GET /freela/curriculo/latest` (link para visualização por empresa)
- Pipeline de propostas
  - `PUT /company/proposals/:id/status`
  - `PUT /company/proposals/:id/stage`
