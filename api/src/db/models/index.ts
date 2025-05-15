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

  // cocktail <> bar
  models.cocktail.belongsTo(models.bar, {
    foreignKey: 'bar_id',
    as: 'bar',  // this is the name of the RELATIONSHIP, not the individual item!
  });
  models.bar.hasMany(models.cocktail, {
    foreignKey: 'bar_id',
    as: 'cocktails',
  });

  // listitems <> list
  models.listitem.belongsTo(models.list, {
    foreignKey: 'list_id',
    as: 'list',
  });
  models.list.hasMany(models.listitem, {
    foreignKey: 'list_id',
    // the below is supposed to work but it doesn't :/
    // onDelete: 'CASCADE',  // delete associated listitems when list is deleted
    // hooks: true,
    as: 'listitems',
  });

  // listitem <> cocktail
  models.listitem.belongsTo(models.cocktail, {
    foreignKey: 'cocktail_id',
    as: 'listedCocktail',
  });

  // list <> user
  models.list.belongsTo(models.user, {
    foreignKey: 'user_id',
    as: 'owner',
  });
  models.user.hasMany(models.list, {
    foreignKey: 'user_id',
    as: 'lists',
  });

  // ratings <> cocktail
  models.rating.belongsTo(models.cocktail, {
    foreignKey: 'cocktail_id',
    as: 'cocktail',
  });
  models.cocktail.hasMany(models.rating, {
    foreignKey: 'cocktail_id',
    as: 'reviews',
  });

  // ratings <> user
  models.rating.belongsTo(models.user, {
    foreignKey: 'user_id',
    as: 'reviewer',
  });
  models.user.hasMany(models.rating, {
    foreignKey: 'user_id',
    as: 'reviews',
  });

  return models;
}

export default {
  initModelsAndAssociations,
}