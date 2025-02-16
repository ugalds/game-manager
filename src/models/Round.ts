import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Round extends Model {
  public id!: number;
  public number!: number;
  public matchId!: number;
  public status!: 'pending' | 'in_progress' | 'finished';
}

Round.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'matches',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'in_progress', 'finished']],
      },
    },
  },
  {
    sequelize,
    modelName: 'Round',
    tableName: 'rounds',
  }
);

export default Round; 