const HOST = "http://localhost:3000";

const getCocktailsWithBars = async () => {
  return makeCall(`${HOST}/cocktailsWithBars`, {
    method: "GET",
  });
}

const getBars = async () => {
  return makeCall(`${HOST}/bars`, {
    method: "GET",
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
  getBars,
};