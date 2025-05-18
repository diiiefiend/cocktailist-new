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

export interface CocktailItem {
  id: number;
  name: string;
  liquor: DRINK_TYPES;
  bar: BarDetails;
  ingredients: string;
  created_at: string;
  updated_at: string;

  avg_rating: number;
  avg_spirited?: number;
  avg_composition: number;

  img_file_name?: string;
  img_content_type?: string;
  img_file_size?: number;
  img_updated_at?: string;
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
  listedCocktail: CocktailItem;
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
  barId?: number;
  barName?: string;
  barAddress?: string;
  ingredients: string;
  img?: any;
}

export interface ReviewSubmission {
  rating: number;
  scaleSpirited: null | number;
  scaleComposition: null | number;
  body: null | string;
}

export interface AddCocktailToListsSubmission {
  listIds: number[];
}

export interface LoginSubmission {
  username: string;
  password: string;
}

export interface CreateAccountSubmission extends LoginSubmission {
  email: string;
}
