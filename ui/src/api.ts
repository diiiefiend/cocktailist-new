import type { CocktailSubmission, CreateAccountSubmission, LoginSubmission } from "./models";

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

const addCocktail = async (cocktailData: CocktailSubmission) => {
  return makeCall(`${API_HOST}/cocktails`, {
    method: 'POST',
    body: JSON.stringify(cocktailData),
  });
};

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

// bar routes

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

// user auth routes

const login = async (loginData: LoginSubmission) => {
  return makeCall(`${API_HOST}/login`, {
    method: 'POST',
    body: JSON.stringify(loginData),
  });
}

const logout = async () => {
  return makeCall(`${API_HOST}/logout`, {
    method: 'POST',
  });
}

const createAccount = async (createAccountData: CreateAccountSubmission) => {
  return makeCall(`${API_HOST}/users`, {
    method: 'POST',
    body: JSON.stringify(createAccountData),
  });
}

const makeCall = async (endpoint: string, options: any) => {
  const decoratedOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    ...options,
  };
  const response = await fetch(endpoint, decoratedOptions);

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
  addCocktail,
  getCocktail,
  getCocktailReviews,
  getBar,
  getBarCocktails,
  getLists,
  getList,
  login,
  logout,
  createAccount,
};