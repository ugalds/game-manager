const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('players', 'generalBoca', {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('players', 'generalBoca');
  }
}; 