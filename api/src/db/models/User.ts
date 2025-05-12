import { DataTypes, Sequelize } from 'sequelize';

const init = (sequelize: Sequelize) => {
  const User = sequelize.define('User', {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password_digest: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      session_token: {
        type: DataTypes.STRING,
        allowNull: false,
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
      uid: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      // Other model options go here
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: 'User', // We need to choose the model name
      tableName: 'users',
      defaultScope: {
        attributes: { exclude: ['password_digest', 'session_token', 'uid', 'provider', 'salt'] },
      },
      scopes: {
        auth: {
          attributes: { include: ['password_digest', 'session_token', 'uid', 'provider', 'salt'] },
        }
      }
    },
  );

  return User;
};

export default init;