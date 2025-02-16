import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'game_manager',
  logging: false,
  define: {
    timestamps: true
  },
});

// Função para sincronizar os modelos com o banco de dados
export const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('Banco de dados sincronizado com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar banco de dados:', error);
  }
};

export default sequelize; 