import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface Player {
  id: number;
  name: string;
  avatar: string;
  points: number;
  categories?: { [key: string]: number };
}

class Match extends Model {
  public id!: number;
  public name!: string;
  public date!: Date;
  public status!: string;
  public players!: Player[];
  public currentPlayer?: number;
  public round!: number;
  public winner?: number;
  public startTime?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'O nome não pode estar vazio'
        }
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'in_progress', 'finished']],
          msg: 'Status inválido'
        }
      }
    },
    players: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidPlayers(value: Player[]) {
          if (!Array.isArray(value)) {
            throw new Error('Players deve ser um array');
          }
          value.forEach(player => {
            if (!player.id || !player.name || !player.avatar) {
              throw new Error('Dados de jogador inválidos');
            }
          });
        }
      }
    },
    currentPlayer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'current_player'
    },
    round: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: {
          args: [1],
          msg: 'A rodada deve ser maior que 0'
        }
      }
    },
    winner: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'start_time'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    }
  },
  {
    sequelize,
    modelName: 'Match',
    tableName: 'matches',
    underscored: true,
    timestamps: true
  }
);

export default Match; 