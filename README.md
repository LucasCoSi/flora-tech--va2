# 🌱 FloraTech API — Monitoramento de Estufas Hidropônicas

> API RESTful desenvolvida com **NestJS**, **TypeORM** e **SQLite** seguindo os princípios da **Arquitetura Hexagonal (Ports & Adapters)**.

---

## 👥 Dupla

| Nome             | Responsabilidade                                                           |
| ---------------- | -------------------------------------------------------------------------- |
| Marcelo Henrique | Entidade Estufa — domain, service, controller, dto, testes unitários       |
| Lucas Costa      | Entidade CicloCultivo — domain, service, controller, dto, testes unitários |

---

## 🎯 Tema

**Monitoramento de Estufas Hidropônicas**

O sistema permite o gerenciamento completo de estufas e seus ciclos de cultivo, com validações robustas de negócio, relacionamento 1:N entre entidades e documentação automática via Swagger.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js >= 18
- pnpm >= 9 (Gerenciador de pacotes utilizado no monorepo)

### Instalação e Execução

Como este projeto utiliza **Turborepo** e **pnpm workspaces**, os comandos devem ser executados na raiz do projeto.

```bash
# 1. Instalar dependências em todos os pacotes
pnpm install

# (Nota para usuários do Windows: se encontrar erro de restrição de script, utilize pnpm.cmd install)

# 2. Iniciar ambas as aplicações (Frontend e Backend) em modo de desenvolvimento
pnpm run dev
# (No Windows utilize: pnpm.cmd run dev)

# 3. Acessos:
# Frontend Angular: http://localhost:4200
# API NestJS: http://localhost:3000
# Swagger API Docs: http://localhost:3000/api
```

> Na primeira execução, o banco SQLite é criado automaticamente na raiz do backend (`apps/backend/data/database.sqlite`)
> e um **seed** popula o banco com um usuário **Administrador**, além de estufas e ciclos de cultivo para demonstração.

**Credenciais do Administrador Padrão:**
- **Email:** admin@floratech.com
- **Senha:** Admin@123

### Executar Testes Unitários

```bash
# Rodar todos os testes
npm test

# Com cobertura
npm run test:cov

# Modo watch
npm run test:watch
```

---

## 📚 Documentação da API (Swagger)

Após iniciar o servidor, acesse: **http://localhost:3000/api**

O Swagger lista e permite testar todos os endpoints interativamente.

---

## 🗄️ Banco de Dados

- **Driver:** SQLite (via `better-sqlite3`)
- **Arquivo:** `./data/database.sqlite`
- **Modo:** `synchronize: true` _(uso exclusivamente acadêmico — em produção usar migrations)_

---

## 📦 Endpoints Principais

### Estufas (`/estufas`)

| Método   | Rota                  | Descrição                                                  |
| -------- | --------------------- | ---------------------------------------------------------- |
| `GET`    | `/estufas`            | Lista todas as estufas                                     |
| `GET`    | `/estufas/:id`        | Busca estufa por ID                                        |
| `GET`    | `/estufas/:id/ciclos` | Busca estufa com todos os ciclos de cultivo (relation 1:N) |
| `POST`   | `/estufas`            | Cria nova estufa                                           |
| `PUT`    | `/estufas/:id`        | Atualiza estufa existente                                  |
| `DELETE` | `/estufas/:id`        | Remove estufa                                              |

### Ciclos de Cultivo (`/ciclos-cultivo`)

| Método   | Rota                               | Descrição                             |
| -------- | ---------------------------------- | ------------------------------------- |
| `GET`    | `/ciclos-cultivo`                  | Lista todos os ciclos de cultivo      |
| `GET`    | `/ciclos-cultivo/:id`              | Busca ciclo por ID                    |
| `GET`    | `/ciclos-cultivo/estufa/:estufaId` | Lista ciclos de uma estufa específica |
| `POST`   | `/ciclos-cultivo`                  | Cria novo ciclo de cultivo            |
| `PUT`    | `/ciclos-cultivo/:id`              | Atualiza ciclo existente              |
| `DELETE` | `/ciclos-cultivo/:id`              | Remove ciclo                          |

---

## ✅ Validações de Negócio Implementadas (7+)

Todas as validações estão **exclusivamente na camada de Service** (Application Layer):

| #   | Validação                                                                 | Exceção               | Entidade     |
| --- | ------------------------------------------------------------------------- | --------------------- | ------------ |
| 1   | Todos os campos obrigatórios devem ser preenchidos                        | `BadRequestException` | Ambas        |
| 2   | `dataInauguracao` não pode ser uma data futura                            | `BadRequestException` | Estufa       |
| 3   | `estufaId` deve referenciar uma estufa **existente e ativa**              | `NotFoundException`   | CicloCultivo |
| 4   | `areaM2` deve ser ≥ 20 m²                                                 | `BadRequestException` | Estufa       |
| 5   | `rendimentoKg` não pode exceder `areaM2 × 8`                              | `BadRequestException` | CicloCultivo |
| 6   | Se `colhida = true`, `rendimentoKg` deve ser > 0                          | `BadRequestException` | CicloCultivo |
| 7   | `dataInicio` do ciclo não pode ser anterior à `dataInauguracao` da estufa | `BadRequestException` | CicloCultivo |
| +   | `rendimentoKg` não pode ser negativo                                      | `BadRequestException` | CicloCultivo |

---

## 🏗️ Arquitetura Hexagonal

```
src/
├── shared/
│   ├── database/         ← Configuração TypeORM + DatabaseModule + Seed
│   └── filters/          ← AllExceptionsFilter (filtro global)
│
├── estufas/
│   ├── domain/           ← Interfaces de domínio (sem ORM, sem HTTP)
│   │   └── estufa.domain.ts
│   ├── application/      ← Regras de negócio + PORT (interface do repositório)
│   │   ├── ports/
│   │   │   └── estufa-repository.port.ts
│   │   └── estufa.service.ts
│   ├── infrastructure/   ← Adapter de persistência (TypeORM)
│   │   └── persistence/typeorm/
│   │       ├── estufa.orm-entity.ts
│   │       └── estufa.typeorm-repository.ts
│   └── presentation/     ← Controller + DTOs (HTTP)
│       ├── controllers/
│       │   └── estufa.controller.ts
│       └── dtos/
│           └── estufa.dto.ts
│
└── ciclos-cultivo/       ← Mesma estrutura hexagonal
```

### Responsabilidades por Camada

| Camada              | Classe     | Responsabilidade                            |
| ------------------- | ---------- | ------------------------------------------- |
| `presentation`      | Controller | Recebe HTTP, valida DTOs, delega ao Service |
| `application`       | Service    | **Todas as regras de negócio**; injeta PORT |
| `application/ports` | Interface  | Contrato do repositório (PORT)              |
| `infrastructure`    | Repository | Implementa PORT; acessa TypeORM/SQLite      |
| `domain`            | Interface  | Modelo de domínio puro (sem ORM)            |

---

## 🧪 Testes Unitários

- **64 testes** cobrindo todos os casos de sucesso e erro
- Repositórios **mockados** (sem acesso ao banco)
- Cobertura total das 7+ validações de negócio

```
Test Suites: 3 passed, 3 total
Tests:       64 passed, 64 total
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia        | Versão    | Uso                     |
| ----------------- | --------- | ----------------------- |
| NestJS            | ^11       | Framework principal     |
| TypeORM           | ^0.3      | ORM para banco de dados |
| better-sqlite3    | ^12       | Driver SQLite           |
| class-validator   | ^0.14     | Validação de DTOs       |
| class-transformer | ^0.5      | Transformação de dados  |
| @nestjs/swagger   | ^11       | Documentação automática |
| Jest + ts-jest    | ^30 / ^29 | Testes unitários        |

---

## 📋 Divisão de Tarefas (Git)

| Feature Branch                   | Funcionalidade                            | Responsável |
| -------------------------------- | ----------------------------------------- | ----------- |
| `feature/estufa-crud`            | CRUD Estufa + validações 1, 2, 4          | Membro A    |
| `feature/ciclo-cultivo-crud`     | CRUD CicloCultivo + validações 3, 5, 6, 7 | Membro B    |
| `feature/hexagonal-architecture` | Estrutura hexagonal + ports/adapters      | Membro A    |
| `feature/swagger-docs`           | Configuração Swagger + decorators         | Membro B    |
| `feature/exception-filter`       | AllExceptionsFilter global                | Membro A    |
| `feature/unit-tests`             | Testes unitários (64 testes)              | Ambos       |

---

## ⚠️ Notas Importantes

- `synchronize: true` está ativo **apenas para fins acadêmicos**. Em produção, utilize `migrations`.
- O arquivo SQLite é criado automaticamente. Não é necessário configurar banco de dados externo.
- O seed de dados roda automaticamente na **primeira inicialização** (banco vazio).
