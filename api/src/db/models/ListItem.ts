import { DataTypes, Sequelize } from 'sequelize';

const init = (sequelize: Sequelize) => {
  const ListItem = sequelize.define('ListItem', {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cocktail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: sequelize.models.User,
        //   key: 'id',
        // },
      },
      list_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: sequelize.models.List,
        //   key: 'id',
        // },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      // dumb that we have this, it never should get updated after creation
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      // Other model options go here
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: 'ListItem', // We need to choose the model name
      tableName: 'listitems',
    },
  );

  return ListItem;
};

export default init;