import { PrismaClient, UserRole, WorkModel } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const empresa = await prisma.user.upsert({
    where: { email: 'empresa@recifreela.local' },
    update: {},
    create: {
      email: 'empresa@recifreela.local',
      passwordHash: 'seed',
      role: UserRole.user_empresa,
      empresaProfile: {
        create: {
          razaoSocial: 'Recife Digital LTDA',
          nomeFantasia: 'Recife Digital',
          cnpj: '00000000000100',
          sobre: 'Empresa exemplo para seed local',
          siteUrl: 'https://example.com'
        }
      }
    },
    include: { empresaProfile: true }
  })

  const freela = await prisma.user.upsert({
    where: { email: 'freela@recifreela.local' },
    update: {},
    create: {
      email: 'freela@recifreela.local',
      passwordHash: 'seed',
      role: UserRole.user_freela,
      freelaProfile: {
        create: {
          nome: 'Freela Recife',
          cpf: '00000000000',
          bio: 'Freela exemplo para seed local',
          disponivel: true,
          nivel: 'PLENO',
          linkedinUrl: 'https://www.linkedin.com/',
          githubUrl: 'https://github.com/'
        }
      }
    },
    include: { freelaProfile: true }
  })

  const job = await prisma.jobPost.create({
    data: {
      empresaUserId: empresa.id,
      titulo: 'Landing page para produto local',
      descricao: 'Job exemplo para validação do MVP: publicar job e receber proposta.',
      orcamentoMinCents: 150000,
      orcamentoMaxCents: 400000,
      modeloTrabalho: WorkModel.HIBRIDO
    }
  })

  await prisma.jobProposal.upsert({
    where: { jobPostId_freelaUserId: { jobPostId: job.id, freelaUserId: freela.id } },
    update: {},
    create: {
      jobPostId: job.id,
      freelaUserId: freela.id,
      mensagem: 'Posso entregar em 7 dias com Next.js e design responsivo.',
      valorPropostoCents: 250000,
      prazoPropostoDias: 7
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })

