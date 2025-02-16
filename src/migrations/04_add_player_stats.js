const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('players', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false
      },
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      victories: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      rounds: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      general: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      riscos: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      "createdAt": {
        type: DataTypes.DATE,
        allowNull: false
      },
      "updatedAt": {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('players');
  }
}; 