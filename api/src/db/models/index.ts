import { Sequelize } from 'sequelize';
import initBar from './Bar';
import initCocktail from './Cocktail';
import initList from './List';
import initListItem from './ListItem';
import initRating from './Rating';
import initUser from './User';

const initModelsAndAssociations = (sequelize: Sequelize) => {
  const models = {
    bar: initBar(sequelize),
    cocktail: initCocktail(sequelize),
    list: initList(sequelize),
    listitem: initListItem(sequelize),
    rating: initRating(sequelize),
    user: initUser(sequelize),
  };

  models.cocktail.belongsTo(models.bar, {
    foreignKey: 'bar_id',
    as: 'bar',
  });
  models.bar.hasMany(models.cocktail, {
    foreignKey: 'bar_id',
    as: 'bar',
  });

  models.listitem.belongsTo(models.list, {
    foreignKey: 'list_id',
    as: 'list',
  });
  models.list.hasMany(models.listitem, {
    foreignKey: 'list_id',
    as: 'list',
  });

  models.list.belongsTo(models.user, {
    foreignKey: 'user_id',
    as: 'owner',
  });
  models.user.hasMany(models.list, {
    foreignKey: 'user_id',
    as: 'owner',
  });

  models.rating.belongsTo(models.cocktail, {
    foreignKey: 'cocktail_id',
    as: 'cocktail',
  });
  models.cocktail.hasMany(models.rating, {
    foreignKey: 'cocktail_id',
    as: 'cocktail',
  });
  models.rating.belongsTo(models.user, {
    foreignKey: 'user_id',
    as: 'reviewer',
  });
  models.user.hasMany(models.rating, {
    foreignKey: 'user_id',
    as: 'reviewer',
  });

  return models;
}

export default {
  initModelsAndAssociations,
}