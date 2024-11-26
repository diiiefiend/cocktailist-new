import { DataTypes, Model } from 'sequelize';
import { getDbInstance } from '..';

const sequelize = getDbInstance();

export class Cocktail extends Model {}

Cocktail.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    liquor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ingredients: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bar_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        // model: Bar,
        // key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    img_file_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    img_content_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    img_file_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    img_updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    avg_rating: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: -1,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'Cocktail', // We need to choose the model name
    tableName: 'cocktails',
  },
);

// the defined model is the class itself
console.log(Cocktail === sequelize.models.Cocktail); // true