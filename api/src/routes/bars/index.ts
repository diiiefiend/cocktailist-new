import { dbConnect, models } from '../../db';

interface BarData {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

const getBars = async () => {
  await dbConnect();
  return await models.bar.findAll();
};

const getBar = async (id: string) => {
  await dbConnect();
  return await models.bar.findByPk(id);
};

const getBarCocktails = async (barId: string) => {
  await dbConnect();
  return await models.cocktail.findAll({
    where: {
      bar_id: barId,
    },
    order: [[ 'updated_at', 'DESC' ]],
  });
}

const addBar = async (barData: BarData) => {
  await dbConnect();

  const { name, address, latitude, longitude} = barData;

  return await models.bar.create({
    name,
    address,
    latitude,
    longitude,
  });
}

const updateBar = async (barId: string, barData: BarData) => {
  await dbConnect();

  const { name, address, latitude, longitude} = barData;

  return await models.bar.update({
    name,
    address,
    latitude,
    longitude,
    }, {
    where: {
      id: barId,
    }
  });
}

export default {
  getBars,
  getBar,
  getBarCocktails,
  addBar,
  updateBar,
}