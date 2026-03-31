-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user_freela', 'user_empresa');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "WorkModel" AS ENUM ('REMOTO', 'HIBRIDO', 'PRESENCIAL');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('ABERTO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('ENVIADA', 'ACEITA', 'RECUSADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "AddressOwnerType" AS ENUM ('FREELA', 'EMPRESA');

-- CreateEnum
CREATE TYPE "CompanyPermission" AS ENUM ('OWNER', 'RECRUITER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freela_profiles" (
    "user_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "bio" TEXT,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "nivel" TEXT,
    "avatar_url" TEXT,
    "linkedin_url" TEXT,
    "github_url" TEXT,

    CONSTRAINT "freela_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "empresa_profiles" (
    "user_id" TEXT NOT NULL,
    "razao_social" TEXT NOT NULL,
    "nome_fantasia" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "sobre" TEXT,
    "logo_url" TEXT,
    "site_url" TEXT,

    CONSTRAINT "empresa_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "owner_type" "AddressOwnerType" NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT,
    "numero" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "uf" TEXT,
    "complemento" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "geocoded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_posts" (
    "id" TEXT NOT NULL,
    "empresa_user_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "prazo" TIMESTAMP(3),
    "orcamento_min_cents" INTEGER,
    "orcamento_max_cents" INTEGER,
    "modelo_trabalho" "WorkModel" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'ABERTO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_proposals" (
    "id" TEXT NOT NULL,
    "job_post_id" TEXT NOT NULL,
    "freela_user_id" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "valor_proposto_cents" INTEGER,
    "prazo_proposto_dias" INTEGER,
    "status" "ProposalStatus" NOT NULL DEFAULT 'ENVIADA',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload_json" JSONB NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freela_resumes" (
    "id" TEXT NOT NULL,
    "freela_user_id" TEXT NOT NULL,
    "file_key" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "freela_resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_members" (
    "id" TEXT NOT NULL,
    "company_user_id" TEXT NOT NULL,
    "member_user_id" TEXT NOT NULL,
    "permission" "CompanyPermission" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_posts" (
    "id" TEXT NOT NULL,
    "freela_user_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "freela_profiles_cpf_key" ON "freela_profiles"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "empresa_profiles_cnpj_key" ON "empresa_profiles"("cnpj");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE INDEX "addresses_owner_user_id_idx" ON "addresses"("owner_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_owner_type_owner_user_id_key" ON "addresses"("owner_type", "owner_user_id");

-- CreateIndex
CREATE INDEX "job_posts_empresa_user_id_idx" ON "job_posts"("empresa_user_id");

-- CreateIndex
CREATE INDEX "job_proposals_freela_user_id_idx" ON "job_proposals"("freela_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_proposals_job_post_id_freela_user_id_key" ON "job_proposals"("job_post_id", "freela_user_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "freela_resumes_freela_user_id_idx" ON "freela_resumes"("freela_user_id");

-- CreateIndex
CREATE INDEX "company_members_company_user_id_idx" ON "company_members"("company_user_id");

-- CreateIndex
CREATE INDEX "company_members_member_user_id_idx" ON "company_members"("member_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_members_company_user_id_member_user_id_key" ON "company_members"("company_user_id", "member_user_id");

-- CreateIndex
CREATE INDEX "service_posts_freela_user_id_idx" ON "service_posts"("freela_user_id");

-- AddForeignKey
ALTER TABLE "freela_profiles" ADD CONSTRAINT "freela_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresa_profiles" ADD CONSTRAINT "empresa_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_posts" ADD CONSTRAINT "job_posts_empresa_user_id_fkey" FOREIGN KEY ("empresa_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_proposals" ADD CONSTRAINT "job_proposals_job_post_id_fkey" FOREIGN KEY ("job_post_id") REFERENCES "job_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_proposals" ADD CONSTRAINT "job_proposals_freela_user_id_fkey" FOREIGN KEY ("freela_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freela_resumes" ADD CONSTRAINT "freela_resumes_freela_user_id_fkey" FOREIGN KEY ("freela_user_id") REFERENCES "freela_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_members" ADD CONSTRAINT "company_members_company_user_id_fkey" FOREIGN KEY ("company_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_members" ADD CONSTRAINT "company_members_member_user_id_fkey" FOREIGN KEY ("member_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_posts" ADD CONSTRAINT "service_posts_freela_user_id_fkey" FOREIGN KEY ("freela_user_id") REFERENCES "freela_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

