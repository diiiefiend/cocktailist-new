import { Sequelize } from 'sequelize';
import initBar from './Bar';
import initCocktail from './Cocktail';
import initList from './List';
import initListItem from './ListItem';

const initModelsAndAssociations = (sequelize: Sequelize) => {
  const models = {
    bar: initBar(sequelize),
    cocktail: initCocktail(sequelize),
    list: initList(sequelize),
    listitem: initListItem(sequelize),
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

  return models;
}

export default {
  initModelsAndAssociations,
}