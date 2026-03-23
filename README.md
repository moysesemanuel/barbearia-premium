# Barbershop Booking System

Sistema web para barbearia com site institucional, agendamento online e backoffice administrativo.

## Visão geral

Este projeto foi construído como case de portfólio com foco em serviços reais para pequenos negócios. A aplicação combina uma landing page comercial com fluxo de agendamento e um painel de administração para gestão do conteúdo e da agenda.

## Funcionalidades

- home institucional com hero, serviços, galeria e contato
- agendamento online por serviço, barbeiro, data e horário
- bloqueio automático de horários ocupados
- backoffice para editar textos, serviços, barbeiros, imagens e datas bloqueadas
- visão diária da agenda por barbeiro
- confirmação, cancelamento e remarcação de agendamentos no admin
- apoio a envio manual por WhatsApp com mensagem pronta

## Stack

- Next.js 16
- React 19
- TypeScript
- Prisma
- SQLite
- CSS Modules

## Como rodar

1. Instale as dependências:

```bash
yarn install
```

2. Crie o arquivo `.env` com base no exemplo:

```bash
cp .env.example .env
```

3. Gere o schema do banco:

```bash
yarn db:push
```

4. Rode o projeto:

```bash
yarn dev
```

Abra [http://localhost:3001](http://localhost:3001).

## Rotas principais

- site público: `/`
- backoffice: `/admin`

## Estrutura

- `src/app`:
  rotas da aplicação e APIs
- `src/components/home`:
  componentes da home pública
- `src/components/admin`:
  componentes do backoffice
- `src/components/shared`:
  utilitários e componentes compartilhados
- `prisma/schema.prisma`:
  modelagem do banco

## Próximos passos

- autenticação real para o admin
- integração automática com WhatsApp API
- deploy em produção
- melhoria do fluxo de onboarding de dados
