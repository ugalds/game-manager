const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('players');
    
    await queryInterface.createTable('players', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 50]
        }
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      victories: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      rounds: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      general: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      general_boca: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      riscos: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('players');
  }
}; 