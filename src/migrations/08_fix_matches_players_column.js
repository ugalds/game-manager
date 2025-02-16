const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Atualiza as colunas existentes
    await queryInterface.changeColumn('matches', 'name', {
      type: DataTypes.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('matches', 'date', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    await queryInterface.changeColumn('matches', 'status', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    });

    await queryInterface.changeColumn('matches', 'players', {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.changeColumn('matches', 'round', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    });

    await queryInterface.changeColumn('matches', 'created_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    await queryInterface.changeColumn('matches', 'updated_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverte as alterações
    await queryInterface.changeColumn('matches', 'name', {
      type: DataTypes.STRING,
      allowNull: true
    });

    await queryInterface.changeColumn('matches', 'date', {
      type: DataTypes.DATE,
      allowNull: true
    });

    await queryInterface.changeColumn('matches', 'status', {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'pending'
    });

    await queryInterface.changeColumn('matches', 'players', {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    });

    await queryInterface.changeColumn('matches', 'round', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    });

    await queryInterface.changeColumn('matches', 'created_at', {
      type: DataTypes.DATE,
      allowNull: true
    });

    await queryInterface.changeColumn('matches', 'updated_at', {
      type: DataTypes.DATE,
      allowNull: true
    });
  }
}; 