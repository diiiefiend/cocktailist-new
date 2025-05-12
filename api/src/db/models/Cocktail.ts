import { DataTypes, Sequelize } from 'sequelize';

const init = (sequelize: Sequelize) => {
  const Cocktail = sequelize.define('Cocktail', {
      // Model attributes are defined here
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
        },
      },
      liquor: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isAlpha: true,
        },
      },
      ingredients: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      bar_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.models.Bar,
          key: 'id',
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
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: 'Cocktail', // We need to choose the model name
      tableName: 'cocktails',
    },
  );

  return Cocktail;
};

export default init;