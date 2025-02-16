const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adiciona a coluna wins
    await queryInterface.addColumn('players', 'wins', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    });

    // Adiciona a coluna losses
    await queryInterface.addColumn('players', 'losses', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    });

    // Remove a coluna victories que será substituída por wins
    await queryInterface.removeColumn('players', 'victories');
  },

  down: async (queryInterface, Sequelize) => {
    // Remove as novas colunas
    await queryInterface.removeColumn('players', 'wins');
    await queryInterface.removeColumn('players', 'losses');

    // Restaura a coluna victories
    await queryInterface.addColumn('players', 'victories', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    });
  }
}; 