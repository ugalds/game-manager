const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criar tabela de jogadores
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
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Criar tabela de partidas
    await queryInterface.createTable('matches', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
      players: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      current_player: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      round: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      winner: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    });

    // Criar tabela de rodadas
    await queryInterface.createTable('rounds', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      match_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'matches',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rounds');
    await queryInterface.dropTable('matches');
    await queryInterface.dropTable('players');
  }
}; 