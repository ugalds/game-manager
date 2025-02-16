const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Primeiro, vamos verificar se a tabela matches existe
      const tableExists = await queryInterface.tableExists('matches');
      if (!tableExists) {
        // Se a tabela não existe, vamos criá-la
        await queryInterface.createTable('matches', {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
          status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
          },
          players: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: []
          },
          round: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
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
      } else {
        // Se a tabela existe, vamos adicionar as colunas que faltam
        const columns = await queryInterface.describeTable('matches');

        if (!columns.round) {
          await queryInterface.addColumn('matches', 'round', {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
          });
        }

        // Atualiza as colunas existentes
        await queryInterface.changeColumn('matches', 'name', {
          type: DataTypes.STRING,
          allowNull: false
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

        // Garante que as colunas de timestamp estão corretas
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
      }
    } catch (error) {
      console.error('Erro na migração:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Reverte as alterações
      const columns = await queryInterface.describeTable('matches');

      if (columns.round) {
        await queryInterface.removeColumn('matches', 'round');
      }

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

      await queryInterface.changeColumn('matches', 'created_at', {
        type: DataTypes.DATE,
        allowNull: true
      });

      await queryInterface.changeColumn('matches', 'updated_at', {
        type: DataTypes.DATE,
        allowNull: true
      });
    } catch (error) {
      console.error('Erro ao reverter migração:', error);
      throw error;
    }
  }
}; 