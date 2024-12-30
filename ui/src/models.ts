// enums

export enum RATING_TYPES {
  RATING,
  SPIRITED_SLIDER,
  INNOVATION_SLIDER,
}

export enum DRINK_TYPES {
  VODKA = 'vodka',
  GIN = 'gin',
  WHISKEY = 'whiskey',
  RUM = 'rum',
  TEQUILA = 'tequila',
  BRANDY = 'brandy',
  WINE = 'wine',
  LIQUEUR = 'liqueur',
  BAIJIU = 'baijiu',
  SAKE = 'sake',
}

// interfaces

export interface Bar {
  id: number;
  name: string;
}

export interface BarDetails extends Bar {
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface CocktailBoxItem {
  id: number;
  name: string;
  liquor: DRINK_TYPES;
  img_file_name: string;
  bar: Bar;
  avg_rating: number;
}

export interface CocktailDetailItem extends CocktailBoxItem {
  ingredients: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface ReviewItem {
  id: number;
  cocktail_id: number;
  user_id: number;
  rating: number;
  body: string | null;
  updated_at: string;
  scale_spirited: number;
  scale_composition: number;
  reviewer: User;
}

export interface List {
    id: number;
    name: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface ListInfo extends List {
  listItems: Array<ListItem>;
}

export interface ListItem {
  id: number;
  cocktail_id: number;
  list_id: number;
  created_at: string;
  updated_at: string;
  listedCocktail: CocktailDetailItem;
}

export interface CoordinatePair {
  x: number;
  y: number;
}

export type ChartData = CoordinatePair[];

// form-related models
export interface CocktailSubmission {
  name: string;
  type: DRINK_TYPES;
  barId: number;
  ingredients: string;
  imgUrl?: string;
}

export interface ReviewSubmission {
  rating: number;
  spiritedRating: null | number;
  innovativeRating: null | number;
  comment: null | string;
}