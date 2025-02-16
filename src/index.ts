import express from 'express';
import cors from 'cors';
import sequelize from './config/database';
import './models/Player';
import './models/Match';
import playerRoutes from './routes/players';
import matchRoutes from './routes/matches';
import { Server } from 'http';
import open from 'open';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();

// Configuração do CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3000', 'http://localhost:3003'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Middleware para parse do JSON
app.use(express.json());

// Rotas
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);

// Função para verificar se o frontend está pronto
const waitForFrontend = async (url: string, maxAttempts: number = 30): Promise<boolean> => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.log(`Aguardando frontend iniciar... (tentativa ${i + 1}/${maxAttempts})`);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
};

const startServer = async (port: number = Number(process.env.PORT) || 3003): Promise<Server> => {
  try {
    const server = await new Promise<Server>((resolve, reject) => {
      const serverInstance = app.listen(port)
        .once('listening', async () => {
          console.log(`Servidor rodando na porta ${port}`);
          const frontendUrl = `http://localhost:${process.env.CLIENT_PORT || 5173}`;
          console.log(`Frontend disponível em: ${frontendUrl}`);
          
          // Aguarda o frontend iniciar e abre o navegador
          const frontendReady = await waitForFrontend(frontendUrl);
          if (frontendReady) {
            await open(frontendUrl);
            console.log('Navegador aberto automaticamente!');
          } else {
            console.log('Não foi possível abrir o navegador automaticamente. Por favor, acesse manualmente.');
          }
          
          resolve(serverInstance);
        })
        .once('error', (err: NodeJS.ErrnoException) => {
          if (err.code === 'EADDRINUSE') {
            console.log(`Porta ${port} já está em uso, tentando próxima porta...`);
            serverInstance.close();
            resolve(startServer(port + 1));
          } else {
            reject(err);
          }
        });
    });

    return server;
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    throw error;
  }
};

const initializeDatabase = async () => {
  try {
    // Tenta conectar ao banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Sincroniza o banco de dados sem forçar recriação das tabelas
    await sequelize.sync({ force: false });
    console.log('Banco de dados sincronizado com sucesso.');
    
    // Inicia o servidor na porta definida no .env
    await startServer(Number(process.env.PORT) || 3003);
    
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error);
    // Fecha a conexão com o banco de dados se houver erro
    try {
      await sequelize.close();
      console.log('Conexão com o banco de dados fechada.');
    } catch (dbError) {
      console.error('Erro ao fechar conexão com banco de dados:', dbError);
    }
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on('uncaughtException', async (error) => {
  console.error('Erro não capturado:', error);
  try {
    await sequelize.close();
    console.log('Conexão com o banco de dados fechada após erro.');
  } catch (dbError) {
    console.error('Erro ao fechar conexão com banco de dados:', dbError);
  }
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Promessa rejeitada não tratada:', reason);
  try {
    await sequelize.close();
    console.log('Conexão com o banco de dados fechada após rejeição não tratada.');
  } catch (dbError) {
    console.error('Erro ao fechar conexão com banco de dados:', dbError);
  }
  process.exit(1);
});

// Tratamento de sinais de encerramento
process.on('SIGTERM', async () => {
  console.log('Recebido sinal SIGTERM. Encerrando aplicação...');
  try {
    await sequelize.close();
    console.log('Conexão com o banco de dados fechada.');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao encerrar aplicação:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('Recebido sinal SIGINT. Encerrando aplicação...');
  try {
    await sequelize.close();
    console.log('Conexão com o banco de dados fechada.');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao encerrar aplicação:', error);
    process.exit(1);
  }
});

// Inicia a aplicação
initializeDatabase(); 