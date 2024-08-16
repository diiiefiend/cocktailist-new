export enum RATING_TYPES {
  RATING,
  SPIRITED_SLIDER,
  INNOVATION_SLIDER,
}

export interface CocktailBoxItem {
  id: number;
  name: string;
  imgUrl: string;
  bar: {
    name: string;
    id: number;
  };
  rating: number;
  type: string;
}

export interface CocktailDetailItem extends CocktailBoxItem {
  ingredients: string;
  totalRatings: number;
}

export interface ReviewSubmission {
  rating: number;
  spiritedRating: null | number;
  innovativeRating: null | number;
  comment: null | string;
}

export interface ReviewItem {
  id: number;
  cocktail_id: number;
  user_id: number;
  rating: number;
  spiritedRating: number;
  innovativeRating: number;
  comment: string | null;
  reviewer: string;
  timestamp: string;
}

export interface List {
    id: number;
    name: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface CoordinatePair {
  x: number;
  y: number;
}

export type ChartData = CoordinatePair[];
