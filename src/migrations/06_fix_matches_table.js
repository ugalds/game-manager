const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Tenta remover a coluna players se ela existir
      await queryInterface.removeColumn('matches', 'players');
    } catch (error) {
      // Ignora o erro se a coluna não existir
      console.log('A coluna players não existe, continuando...');
    }

    // Adiciona a coluna players com o tipo correto
    await queryInterface.addColumn('matches', 'players', {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    });
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // No down, vamos reverter as alterações
      await queryInterface.removeColumn('matches', 'players');
      await queryInterface.addColumn('matches', 'players', {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: []
      });
    } catch (error) {
      console.error('Erro ao reverter migração:', error);
    }
  }
}; 