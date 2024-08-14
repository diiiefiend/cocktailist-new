export const mockCocktailData = [
  {
    id: 1,
    name: "The Last Word",
    imgUrl: "/images/test-drinks/fairlady.jpg",
    // bar: "The Nomad Bar",
    bar: {
      name: "The Nomad Bar",
      id: 1,
    },
    rating: 3.5,
    type: "gin"
  },
  {
    id: 2,
    name: "Vodka Drink",
    imgUrl:
      "https://s3.amazonaws.com/cocktailist-pro/cocktails/imgs/000/000/008/small/queensparkswizzle.jpg",
    bar: {
      name: "wherever",
      id: 2,
    },
    rating: 2.2,
    type: "vodka"
  },
  {
    id: 3,
    name: "Tequila Drink",
    imgUrl:
      "https://s3.amazonaws.com/cocktailist-pro/cocktails/imgs/000/000/008/small/queensparkswizzle.jpg",
    bar: {
      name: "wherever",
      id: 2,
    },
    rating: 3.8,
    type: "tequila"
  },
  {
    id: 4,
    name: "Whiskey Drink",
    imgUrl:
      "https://s3.amazonaws.com/cocktailist-pro/cocktails/imgs/000/000/008/small/queensparkswizzle.jpg",
    bar: {
      name: "wherever",
      id: 2,
    },
    rating: 4.3,
    type: "whiskey"
  },
  {
    id: 5,
    name: "Rum Drink",
    imgUrl:
      "https://s3.amazonaws.com/cocktailist-pro/cocktails/imgs/000/000/008/small/queensparkswizzle.jpg",
    bar: {
      name: "wherever",
      id: 2,
    },
    rating: 5,
    type: "rum"
  },
  {
    id: 6,
    name: "The Red Dragon",
    imgUrl: "/images/test-drinks/red-dragon.jpg",
    bar: {
      name: "The Third Man",
      id: 3,
    },
    rating: 3,
    type: "baijiu"
  },
  {
    id: 7,
    name: "Really Long Name Vodka Drink",
    imgUrl:
      "https://s3.amazonaws.com/cocktailist-pro/cocktails/imgs/000/000/008/small/queensparkswizzle.jpg",
    bar: {
      name: "wherever",
      id: 2,
    },
    rating: 5,
    type: "vodka"
  }
];

export const mockCocktailDetailData = [
  {
    ...mockCocktailData[0],
    ingredients: "green chartreuse, gin, maraschino liqueur, lime juice",
    totalRatings: 2
  },
  {
    ...mockCocktailData[5],
    ingredients: "baijiu, lemon, watermelon, basil, green chartreuse",
    totalRatings: 2
  }
];

export const mockBarData = [
  {
  id: 1,
  name: "The Nomad Bar",
  address: "123 Alphabet St, New York, NY 10016"
  },
  {
    id: 2,
    name: "wherever",
    address: "doop doop street, Brooklyn, NY 11216"
  },
  {
    id: 3,
    name: "The Third Man",
    address: "999 Ave C, New York, NY 10001",
  },
];

export const mockReviewData = [
  {
    id: 123,
    cocktail_id: 1,
    user_id: 2,
    reviewer: "Ariel",
    timestamp: "October 15th, 2020",
    rating: 4,
    spiritedRating: 4,
    innovationRating: 5,
    comment:
      "That refreshing (cough cough) baijiu taste! I'm always curious about baijiu cocktails but so far haven't found one that particularly works well with the flavor."
  },
  {
    id: 456,
    cocktail_id: 1,
    user_id: 3,
    reviewer: "Frank",
    timestamp: "September 10th, 2016",
    rating: 3,
    spiritedRating: 6,
    innovationRating: 7,
    comment:
      "I am such a lightweight now. Normally I can drink 5 or 6 of these drinks but nowadays even one makes me feel tipsy. Pretty sad."
  }
];

export const mockListsData = [
  {
    id: 1,
    name: "to try",
    user_id: 2,
    created_at: "2015-09-22 09:45:05",
    updated_at: "2015-09-23 19:44:53",
  },
  {
    id: 2,
    name: "Done and done",
    user_id: 2,
    created_at: "2015-09-22 09:45:05",
    updated_at: "2015-09-23 19:44:53",
  },
];

export const mockListItemsData = [
  {
    id: 1,
    cocktail_id: 2,
    list_id: 2,
    created_at: "2015-09-22 09:45:05",
    updated_at: "2015-09-23 19:44:53",
  },
  {
    id: 2,
    cocktail_id: 4,
    list_id: 1,
    created_at: "2015-09-22 09:45:05",
    updated_at: "2015-09-23 19:44:53",
  },
];
