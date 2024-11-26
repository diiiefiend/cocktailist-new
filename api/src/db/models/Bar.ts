import { DataTypes, Sequelize } from 'sequelize';

const init = (sequelize: Sequelize) => {
  const Bar = sequelize.define('Bar', {
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
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
    },
    {
      // Other model options go here
      timestamps: false,
      modelName: 'Bar', // We need to choose the model name
      tableName: 'bars',
    },
  );

  return Bar;
};

export default init;

