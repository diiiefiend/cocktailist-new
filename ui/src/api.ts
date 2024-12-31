let API_HOST: string;
switch (window.location.hostname) {
  case 'localhost':
    API_HOST = 'http://localhost:8005';
    break;
  case 'cocktailist.club':
    API_HOST = 'https://api.cocktailist.club';
    break;
}

// browse routes
const getCocktailsWithBars = async () => {
  return makeCall(`${API_HOST}/cocktails`, {
    method: 'GET',
  });
}

const getLiquorList = async () => {
  return makeCall(`${API_HOST}/liquors`, {
    method: 'GET',
  });
}

const getBars = async () => {
  return makeCall(`${API_HOST}/bars`, {
    method: 'GET',
  });
}

// cocktail detail routes
const getCocktail = async (id: string) => {
  return makeCall(`${API_HOST}/cocktails/${id}`, {
    method: 'GET',
  });
}

const getCocktailReviews = async (cocktailId: string) => {
  return makeCall(`${API_HOST}/cocktails/${cocktailId}/reviews`, {
    method: 'GET',
  });
}

const getBar = async (id: string) => {
  return makeCall(`${API_HOST}/bars/${id}`, {
    method: 'GET',
  });
}

// additional bar routes
const getBarCocktails = async (id: string) => {
  return makeCall(`${API_HOST}/bars/${id}/cocktails`, {
    method: 'GET',
  });
}

// list routes

const getLists = async () => {
  return makeCall(`${API_HOST}/lists`, {
    method: 'GET',
  });
}

const getList = async (id: string) => {
  return makeCall(`${API_HOST}/lists/${id}`, {
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
  getBarCocktails,
  getLists,
  getList,
};