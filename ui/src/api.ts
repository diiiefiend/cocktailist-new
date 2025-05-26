import type { AddCocktailToListsSubmission, CocktailSubmission, CreateAccountSubmission, LoginSubmission, ReviewSubmission } from "./models";

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

const getCocktailsWithBars = async (pageNumber?: number) => {
  const queryParams = pageNumber ? `?${new URLSearchParams({ page: ''+pageNumber })}` : '';

  return makeCall(`${API_HOST}/cocktails${queryParams}`, {
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
  // this call expects the payload to be FormData!
  return makeCall(`${API_HOST}/cocktails`, {
    method: 'POST',
    body: cocktailData,
  }, true);
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

const getListItemsForCocktail = async (cocktailId: string) => {
  return makeCall(`${API_HOST}/cocktails/${cocktailId}/lists`, {
    method: 'GET',
  });
}

const addCocktailToLists = async (cocktailId: number, listsData: AddCocktailToListsSubmission) => {
  return makeCall(`${API_HOST}/cocktails/${cocktailId}/lists`, {
    method: 'POST',
    body: JSON.stringify(listsData),
  });
};

const updateCocktail = async (cocktailId: number, cocktailData: CocktailSubmission) => {
  // this call expects the payload to be FormData!
  return makeCall(`${API_HOST}/cocktails/${cocktailId}`, {
    method: 'PUT',
    body: cocktailData,
  }, true);
};

const addReview = async (cocktailId: number, reviewData: ReviewSubmission) => {
  return makeCall(`${API_HOST}/cocktails/${cocktailId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
};

const updateReview = async (reviewId: number, reviewData: ReviewSubmission) => {
  return makeCall(`${API_HOST}/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData),
  });
};

const deleteReview = async (reviewId: number) => {
  return makeCall(`${API_HOST}/reviews/${reviewId}`, {
    method: 'DELETE',
  });
};

// bar routes

const getBar = async (id: string) => {
  return makeCall(`${API_HOST}/bars/${id}`, {
    method: 'GET',
  });
}

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

const getList = async (id: number) => {
  return makeCall(`${API_HOST}/lists/${id}`, {
    method: 'GET',
  });
}

const addList = async (listData: { name: string }) => {
  return makeCall(`${API_HOST}/lists`, {
    method: 'POST',
    body: JSON.stringify(listData),
  });
};

const deleteList = async (id: number) => {
  return makeCall(`${API_HOST}/lists/${id}`, {
    method: 'DELETE',
  });
}

const deleteItemFromList = async (id: number) => {
  return makeCall(`${API_HOST}/listitems/${id}`, {
    method: 'DELETE',
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

const makeCall = async (endpoint: string, options: any, isFormData?: boolean) => {
  const csrfTokenMatcher = document.cookie.match(new RegExp('(^| )' + 'cocktailist.token' + '=([^;]+)'));
  let csrfToken = '';
  if (csrfTokenMatcher) {
    csrfToken = csrfTokenMatcher[2];
  }

  const decoratedOptions = {
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(csrfTokenMatcher ? { "X-CSRF-Token": csrfToken } : {}),
    },
    credentials: 'include',
    ...options,
  };

  const response = await fetch(endpoint, decoratedOptions);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  return json;
}

export {
  getCocktailsWithBars,
  getLiquorList,
  getBars,
  addCocktail,
  getCocktail,
  getCocktailReviews,
  getListItemsForCocktail,
  addCocktailToLists,
  updateCocktail,
  addReview,
  updateReview,
  deleteReview,
  getBar,
  getBarCocktails,
  getLists,
  getList,
  addList,
  deleteList,
  deleteItemFromList,
  login,
  logout,
  createAccount,
};