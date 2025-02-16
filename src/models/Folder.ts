import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Folder extends Model {
  public id!: number;
  public name!: string;
  public parentId!: number | null;
}

Folder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'folders',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Folder',
    tableName: 'folders',
  }
);

export default Folder; 