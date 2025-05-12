import { DataTypes, Sequelize } from 'sequelize';

const init = (sequelize: Sequelize) => {
  const Rating = sequelize.define('Rating', {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          // model: sequelize.models.User,
          // key: 'id',
        },
      },
      cocktail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.models.Cocktail,
          key: 'id',
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNumeric: true,
          min: 1,
          max: 5,
        },
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      scale_composition: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isNumeric: true,
          min: 1,
          max: 10,
        },
      },
      scale_spirited: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isNumeric: true,
          min: 1,
          max: 10,
        },
      },
    },
    {
      // Other model options go here
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: 'Rating', // We need to choose the model name
      tableName: 'ratings',
    },
  );

  return Rating;
};

export default init;