# Documentação Backend - OdontoLegal

## Índice

1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Configuração do Ambiente](#configuração-do-ambiente)
5. [API Endpoints](#api-endpoints)
6. [Banco de Dados](#banco-de-dados)
7. [Middlewares](#middlewares)
8. [Segurança](#segurança)
9. [Logs e Monitoramento](#logs-e-monitoramento)

## Visão Geral

O backend do OdontoLegal é uma API RESTful construída com Node.js e Express, fornecendo uma interface robusta para gerenciamento de dados odontológicos, incluindo casos, evidências, relatórios e registros dentários. O sistema utiliza MongoDB como banco de dados e implementa diversas funcionalidades de segurança e validação.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para Node.js
- **MongoDB**: Banco de dados NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticação e autorização
- **Bcrypt**: Criptografia de senhas
- **Multer**: Upload de arquivos
- **PDFKit**: Geração de PDFs
- **Winston**: Sistema de logs
- **Nodemailer**: Envio de emails
- **Joi**: Validação de dados
- **CORS**: Segurança de Cross-Origin

## Estrutura do Projeto

```
/
├── config/         # Configurações (DB, CORS, etc)
├── controllers/    # Controladores da aplicação
├── middleware/     # Middlewares personalizados
├── models/         # Modelos do Mongoose
├── routes/         # Rotas da API
├── utils/          # Funções utilitárias
├── logs/          # Arquivos de log
├── public/        # Arquivos estáticos
└── server.js      # Ponto de entrada da aplicação
```

## Configuração do Ambiente

### Pré-requisitos

- Node.js (versão LTS recomendada)
- MongoDB instalado e rodando
- npm ou yarn

### Instalação

1. Clone o repositório

```bash
git clone https://github.com/dvdmarveira/peri-backend.git
cd PlataformaOdontoLegal-main
```

2. Instale as dependências

```bash
npm install
```

3. Configure as variáveis de ambiente
   Crie um arquivo `.env` com as seguintes variáveis:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/odontolegal
JWT_SECRET=seu_jwt_secret
EMAIL_USER=seu_email
EMAIL_PASS=sua_senha
EMAIL_HOST=seu_smtp_host
EMAIL_PORT=587
NODE_ENV=development
```

### Scripts Disponíveis

- `npm start`: Inicia o servidor
- `npm run dev`: Inicia o servidor em modo desenvolvimento (com nodemon)

## API Endpoints

### Usuários

- `POST /api/users/register`: Registro de novo usuário
- `POST /api/users/login`: Login de usuário
- `GET /api/users/profile`: Obtém perfil do usuário
- `PUT /api/users/profile`: Atualiza perfil do usuário

### Casos

- `GET /api/cases`: Lista todos os casos
- `POST /api/cases`: Cria novo caso
- `GET /api/cases/:id`: Obtém caso específico
- `PUT /api/cases/:id`: Atualiza caso
- `DELETE /api/cases/:id`: Remove caso

### Evidências

- `GET /api/evidences`: Lista todas as evidências
- `POST /api/evidences`: Adiciona nova evidência
- `GET /api/evidences/:id`: Obtém evidência específica
- `PUT /api/evidences/:id`: Atualiza evidência
- `DELETE /api/evidences/:id`: Remove evidência

### Relatórios

- `GET /api/reports`: Lista todos os relatórios
- `POST /api/reports`: Gera novo relatório
- `GET /api/reports/:id`: Obtém relatório específico
- `GET /api/reports/:id/download`: Download do relatório em PDF

### Registros Dentários

- `GET /api/dental-records`: Lista todos os registros
- `POST /api/dental-records`: Cria novo registro
- `GET /api/dental-records/:id`: Obtém registro específico
- `PUT /api/dental-records/:id`: Atualiza registro
- `DELETE /api/dental-records/:id`: Remove registro

### Pacientes

- `GET /api/patients`: Lista todos os pacientes
- `POST /api/patients`: Cadastra novo paciente
- `GET /api/patients/:id`: Obtém paciente específico
- `PUT /api/patients/:id`: Atualiza paciente
- `DELETE /api/patients/:id`: Remove paciente

## Banco de Dados

### Modelos

O sistema utiliza MongoDB com Mongoose para modelagem de dados. Os principais modelos são:

- User (Usuário)
- Case (Caso)
- Evidence (Evidência)
- Report (Relatório)
- DentalRecord (Registro Dentário)
- Patient (Paciente)

### Validações

- Utilizamos Joi para validação de dados de entrada
- Mongoose Schemas para validação de dados no banco
- Middlewares personalizados para validações específicas

## Middlewares

- **authMiddleware**: Autenticação JWT
- **errorHandler**: Tratamento centralizado de erros
- **uploadMiddleware**: Configuração do Multer para upload de arquivos
- **validationMiddleware**: Validações com Joi
- **logMiddleware**: Registro de logs de requisições

## Segurança

- Autenticação via JWT
- Senhas criptografadas com bcrypt
- Proteção contra CSRF
- Configuração CORS
- Rate Limiting
- Sanitização de dados
- Headers de segurança

## Logs e Monitoramento

- Winston para logging estruturado
- Logs de erros separados
- Logs de acesso
- Monitoramento de performance
- Rastreamento de erros

### Problemas Comuns

1. Conexão com banco de dados

   - Verifique string de conexão
   - Verifique se MongoDB está rodando
   - Verifique firewall

2. Upload de arquivos

   - Verifique permissões de diretório
   - Verifique limites de tamanho
   - Verifique tipos de arquivo permitidos

3. Autenticação
   - Verifique JWT_SECRET
   - Verifique expiração do token
   - Verifique headers da requisição

