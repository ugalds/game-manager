const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'postgres'
});

async function createDatabase() {
  try {
    await client.connect();
    await client.query('CREATE DATABASE game_manager');
    console.log('Banco de dados criado com sucesso!');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('O banco de dados já existe.');
    } else {
      console.error('Erro ao criar banco de dados:', error);
    }
  } finally {
    await client.end();
  }
}

createDatabase(); 