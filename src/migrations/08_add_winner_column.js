const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('matches', 'winner', {
        type: DataTypes.INTEGER,
        allowNull: true
      });
      console.log('Coluna winner adicionada com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar coluna winner:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('matches', 'winner');
      console.log('Coluna winner removida com sucesso');
    } catch (error) {
      console.error('Erro ao remover coluna winner:', error);
      throw error;
    }
  }
}; 