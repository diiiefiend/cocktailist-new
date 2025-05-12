import { dbConnect, models } from '../../db';

interface ReviewData {
  cocktailId: number;
  rating: number;
  body?: string;
  scaleComposition?: number;
  scaleSpirited?: number;
}

const getReviewsForCocktail = async (cocktailId: string) => {
  await dbConnect();
  return await models.rating.findAll({
    where: {
      cocktail_id: cocktailId,
    },
    include: [{
      association: 'reviewer',
      required: true,
      attributes: {
        exclude: ['created_at', 'updated_at', 'password_digest', 'session_token', 'uid', 'provider'],
      },
    }],
  });
};

const addReview = async (reviewData: ReviewData, userId: number) => {
  await dbConnect();

  const { cocktailId, rating, body, scaleComposition, scaleSpirited } = reviewData;

  // confirm the user doesn't have a list already with the same name
  const existingReview = await models.rating.findOne({
    where: {
      cocktail_id: cocktailId,
      user_id: userId,
    }
  });

  if (existingReview) {
    throw new Error('review from user for that cocktail already exists!');
  }

  await models.rating.create({
    cocktail_id: cocktailId,
    user_id: userId,
    rating,
    body,
    scale_composition: scaleComposition,
    scale_spirited: scaleSpirited,
  });
}

const updateReview = async (reviewId: string, reviewData: ReviewData, userId: number) => {
  await dbConnect();

  const { rating, body, scaleComposition, scaleSpirited } = reviewData;

  await models.list.update({
    rating,
    body,
    scale_composition: scaleComposition,
    scale_spirited: scaleSpirited,
    }, {
    where: {
      id: reviewId,
      user_id: userId,
    }
  });
}

const deleteReview = async (reviewId: string, userId: number) => {
  await dbConnect();

  await models.list.destroy({
    where: {
      id: reviewId,
      user_id: userId,
    }
  });
}

export default {
  getReviewsForCocktail,
  addReview,
  updateReview,
  deleteReview,
}