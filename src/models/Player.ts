import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Player extends Model {
  public id!: number;
  public name!: string;
  public avatar!: string;
  public points!: number;
  public wins!: number;
  public losses!: number;
  public rounds!: number;
  public general!: number;
  public generalBoca!: number;
  public riscos!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Player.init(
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
        },
        len: {
          args: [2, 50],
          msg: 'O nome deve ter entre 2 e 50 caracteres'
        }
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'O avatar não pode estar vazio'
        }
      }
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'A pontuação não pode ser negativa'
        }
      }
    },
    wins: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'O número de vitórias não pode ser negativo'
        }
      }
    },
    losses: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'O número de derrotas não pode ser negativo'
        }
      }
    },
    rounds: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'O número de rodadas não pode ser negativo'
        }
      }
    },
    general: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'O número de general não pode ser negativo'
        }
      }
    },
    generalBoca: {
      type: DataTypes.INTEGER,
      field: 'general_boca',
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'O número de general de boca não pode ser negativo'
        }
      }
    },
    riscos: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'O número de riscos não pode ser negativo'
        }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  },
  {
    sequelize,
    modelName: 'Player',
    tableName: 'players',
    underscored: true
  }
);

export default Player; 