# FloraTech - Monitoramento de Estufas Hidroponicas

Aplicacao full stack em monorepo para gerenciamento de estufas hidroponicas e ciclos de cultivo. O projeto foi desenvolvido para a atividade avaliativa da 2VA de Programacao Web I, integrando backend NestJS, autenticacao JWT e frontend Angular 20.

## Integrantes

| Nome | Responsabilidades principais |
| --- | --- |
| Marcelo Henrique | CRUD de Estufas, regras de negocio, backend e testes |
| Lucas Costa | CRUD de Ciclos de Cultivo, frontend, autenticacao e integracao |

## Tema

Monitoramento de Estufas Hidroponicas.

O sistema permite cadastrar e administrar estufas, registrar ciclos de cultivo vinculados a cada estufa, controlar usuarios pendentes de ativacao e demonstrar mensagens de erro retornadas pelo backend diretamente na interface.

## Estrutura do Monorepo

```text
flora-tech-master/
|-- apps/
|   |-- backend/      # API NestJS 11, TypeORM, JWT e Swagger
|   `-- frontend/     # Angular 20 standalone, TailwindCSS e HttpClient
|-- packages/
|   |-- utils/        # Tipos compartilhados entre frontend e backend
|   |-- eslint-config/
|   `-- typescript-config/
|-- specs/
|-- .agents/
|-- .env.example
|-- package.json
|-- pnpm-workspace.yaml
|-- turbo.json
`-- README.md
```

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Monorepo | pnpm workspaces, Turborepo |
| Backend | NestJS 11, TypeORM, SQL.js/SQLite, Passport JWT, bcrypt, Swagger |
| Frontend | Angular 20, Standalone Components, Signals, Reactive Forms, TailwindCSS |
| Testes | Jest no backend, Vitest/Angular no frontend |

## Pre-requisitos

- Node.js 18 ou superior
- pnpm 10.x ou superior
- Git

No Windows, caso o PowerShell bloqueie scripts, use `pnpm.cmd` nos comandos.

## Configuracao

1. Instale as dependencias na raiz:

```bash
pnpm install
```

2. Confira as variaveis documentadas em `.env.example`:

```env
PORT=3000
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=60m
ADMIN_EMAIL=admin@floratech.com
ADMIN_PASSWORD=Admin@123
ADMIN_NAME=Administrador
```

O backend le o arquivo `.env` dentro de `apps/backend`. Para desenvolvimento local, use os mesmos valores do `.env.example` da raiz em `apps/backend/.env`.

## Como Executar

Execute tudo pela raiz do monorepo:

```bash
pnpm dev
```

No Windows:

```bash
pnpm.cmd run dev
```

Acessos principais:

| Servico | URL |
| --- | --- |
| Frontend Angular | http://localhost:4200 |
| Backend NestJS | http://localhost:3000 |
| Swagger | http://localhost:3000/api |

O comando `pnpm dev` sobe backend e frontend em paralelo via Turborepo.

## Credenciais de Administrador

Na primeira execucao, o seed cria um usuario administrador ativo:

| Campo | Valor |
| --- | --- |
| Email | `admin@floratech.com` |
| Senha | `Admin@123` |

Novos usuarios cadastrados pelo frontend entram com `ativo = false` e precisam ser aprovados pelo administrador em `/admin/users`.

## Funcionalidades

- Cadastro de usuario com conta pendente de ativacao.
- Login com JWT.
- Senha armazenada com hash bcrypt.
- Rotas de CRUD protegidas por `JwtAuthGuard`.
- Rotas administrativas protegidas por perfil `admin`.
- Dashboard protegido com nome do usuario logado e logout.
- CRUD completo de Estufas.
- CRUD completo de Ciclos de Cultivo com selecao da Estufa por dropdown.
- Listagem de usuarios para administrador.
- Ativacao e desativacao de usuarios.
- Interceptor HTTP para envio automatico do Bearer Token.
- Tratamento de sessao expirada ao receber `401`.
- Exibicao das mensagens de erro retornadas pelo backend nos formularios e nas acoes.
- Modal de confirmacao para exclusao nas listagens.

## Rotas do Frontend

| Rota | Protecao | Descricao |
| --- | --- | --- |
| `/login` | Publica | Login com email e senha |
| `/register` | Publica | Cadastro de nova conta |
| `/dashboard` | Autenticada | Pagina inicial protegida |
| `/estufas` | Autenticada | Listagem da entidade pai |
| `/estufas/nova` | Autenticada | Cadastro de estufa |
| `/estufas/editar/:id` | Autenticada | Edicao de estufa |
| `/ciclos` | Autenticada | Listagem da entidade filha |
| `/ciclos/novo` | Autenticada | Cadastro de ciclo |
| `/ciclos/editar/:id` | Autenticada | Edicao de ciclo |
| `/admin/users` | Admin | Gestao de usuarios |

## Endpoints da API

### Autenticacao

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `POST` | `/auth/register` | Cadastra usuario inativo |
| `POST` | `/auth/login` | Autentica usuario ativo e retorna JWT |

Exemplo de login:

```json
{
  "email": "admin@floratech.com",
  "senha": "Admin@123"
}
```

### Usuarios

Rotas protegidas por JWT e perfil administrador.

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/users` | Lista usuarios |
| `PATCH` | `/users/:id/activate` | Ativa ou desativa usuario |

Exemplo de ativacao:

```json
{
  "ativo": true
}
```

### Estufas

Rotas protegidas por JWT.

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/estufas` | Lista estufas |
| `GET` | `/estufas/:id` | Busca estufa por ID |
| `GET` | `/estufas/:id/ciclos` | Busca estufa com ciclos relacionados |
| `POST` | `/estufas` | Cria estufa |
| `PUT` | `/estufas/:id` | Atualiza estufa |
| `DELETE` | `/estufas/:id` | Remove estufa |

Exemplo de criacao:

```json
{
  "nome": "Estufa A-1",
  "dataInauguracao": "2024-01-15",
  "ativa": true,
  "areaM2": 120
}
```

### Ciclos de Cultivo

Rotas protegidas por JWT.

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/ciclos-cultivo` | Lista ciclos |
| `GET` | `/ciclos-cultivo/:id` | Busca ciclo por ID |
| `GET` | `/ciclos-cultivo/estufa/:estufaId` | Lista ciclos de uma estufa |
| `POST` | `/ciclos-cultivo` | Cria ciclo |
| `PUT` | `/ciclos-cultivo/:id` | Atualiza ciclo |
| `DELETE` | `/ciclos-cultivo/:id` | Remove ciclo |

Exemplo de criacao:

```json
{
  "variedadePlanta": "Alface Crespa",
  "dataInicio": "2024-02-01",
  "colhida": false,
  "rendimentoKg": 0,
  "estufaId": 1
}
```

## Formato de Erro

O backend usa um filtro global de excecoes para padronizar respostas:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Erro de validacao nos dados enviados.",
  "errors": {
    "areaM2": ["A area deve ser de pelo menos 20 m2."]
  },
  "timestamp": "2026-06-20T22:00:00.000Z",
  "path": "/estufas"
}
```

O frontend usa o campo `message` como fonte principal para alertas e usa `errors` para exibir mensagens ao lado dos campos dos formularios.

## Regras de Negocio

As validacoes de dominio permanecem no backend, na camada de service:

| Regra | Entidade |
| --- | --- |
| Campos obrigatorios devem ser preenchidos | Estufa e Ciclo |
| Data de inauguracao da estufa nao pode ser futura | Estufa |
| Area da estufa deve ser de pelo menos 20 m2 | Estufa |
| Ciclo deve estar vinculado a estufa existente e ativa | Ciclo |
| Rendimento nao pode ser negativo | Ciclo |
| Rendimento nao pode exceder `areaM2 * 8` | Ciclo |
| Se `colhida = true`, rendimento deve ser maior que 0 | Ciclo |
| Data de inicio do ciclo nao pode ser anterior a inauguracao da estufa | Ciclo |

## Arquitetura do Backend

O backend segue organizacao inspirada em Arquitetura Hexagonal:

```text
apps/backend/src/
|-- auth/
|   |-- application/
|   |-- domain/
|   |-- infrastructure/
|   `-- presentation/
|-- estufas/
|   |-- application/
|   |-- domain/
|   |-- infrastructure/
|   `-- presentation/
|-- ciclos-cultivo/
|   |-- application/
|   |-- domain/
|   |-- infrastructure/
|   `-- presentation/
`-- shared/
    |-- database/
    `-- filters/
```

## Qualidade e Testes

Rodar build:

```bash
pnpm build
```

Rodar testes:

```bash
pnpm test
```

No Windows:

```bash
pnpm.cmd run build
pnpm.cmd run test
```

Resultado validado nesta entrega:

| Comando | Resultado |
| --- | --- |
| `pnpm.cmd run build` | Passou |
| `pnpm.cmd run test` | Passou |
| Backend Jest | 64 testes passando |
| Frontend Angular/Vitest | 2 testes passando |

## Git e Entrega

- Repositorio unico em monorepo.
- Branch principal: `main`.
- Historico com mais de 10 commits logicos em Conventional Commits.
- Projeto enviado para: https://github.com/LucasCoSi/flora-tech--va2

## Divisao de Tarefas

| Integrante | Atividades |
| --- | --- |
| Marcelo Henrique | Modelagem e CRUD de Estufas, regras de negocio, testes do backend |
| Lucas Costa | Modelagem e CRUD de Ciclos de Cultivo, autenticacao, frontend Angular, integracao com API |

## Observacoes

- O token JWT fica em memoria no frontend, sem uso de `localStorage`.
- O banco e criado automaticamente em desenvolvimento.
- `synchronize: true` esta ativo apenas para fins academicos. Em producao, o correto seria usar migrations.
- Arquivos `.env` reais nao devem ser enviados ao Git.
