# Game Manager

Uma aplicação moderna e intuitiva para gerenciar partidas, rodadas e jogadores, inspirada na interface do Notion.

## Requisitos

- Node.js (v14 ou superior)
- PostgreSQL (v12 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo .env com suas variáveis de ambiente:
```env
PORT=3000
DB_HOST=localhost
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
DB_NAME=game_manager
JWT_SECRET=sua_chave_secreta
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Funcionalidades

- ✨ Interface moderna inspirada no Notion
- 📁 Organização em pastas
- 🎮 Gerenciamento de partidas
- 🔄 Controle de rodadas
- 👥 Cadastro de jogadores
- 🔒 Sistema de autenticação
- 📱 Design responsivo

## Estrutura do Projeto

```
src/
  ├── config/        # Configurações do projeto
  ├── controllers/   # Controladores da aplicação
  ├── models/        # Modelos do banco de dados
  ├── routes/        # Rotas da API
  ├── middlewares/   # Middlewares
  └── database/      # Configurações do banco de dados
```

## Tecnologias Utilizadas

- TypeScript
- Node.js
- Express
- Sequelize
- PostgreSQL
- React
- Material-UI 