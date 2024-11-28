const HOST = 'http://localhost:3000';

// browse routes
const getCocktailsWithBars = async () => {
  return makeCall(`${HOST}/cocktailsWithBars`, {
    method: 'GET',
  });
}

const getLiquorList = async () => {
  return makeCall(`${HOST}/liquors`, {
    method: 'GET',
  });
}

const getBars = async () => {
  return makeCall(`${HOST}/bars`, {
    method: 'GET',
  });
}

// cocktail detail routes
const getCocktail = async (id: string) => {
  return makeCall(`${HOST}/cocktails/${id}`, {
    method: 'GET',
  });
}

const getCocktailReviews = async (cocktailId: string) => {
  return makeCall(`${HOST}/cocktails/${cocktailId}/reviews`, {
    method: 'GET',
  });
}

const getBar = async (id: string) => {
  return makeCall(`${HOST}/bars/${id}`, {
    method: 'GET',
  });
}

const getLists = async () => {
  return makeCall(`${HOST}/lists`, {
    method: 'GET',
  });
}

const getList = async (id: string) => {
  return makeCall(`${HOST}/lists/${id}`, {
    method: 'GET',
  });
}

const makeCall = async (endpoint: string, options: any) => {
  const response = await fetch(endpoint, options);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  console.log(json);
  return json;
}

export {
  getCocktailsWithBars,
  getLiquorList,
  getBars,
  getCocktail,
  getCocktailReviews,
  getBar,
  getLists,
  getList,
};