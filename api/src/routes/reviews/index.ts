import { Sequelize } from 'sequelize';
import { dbConnect, models } from '../../db';

interface ReviewData {
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
    order: [[ 'updated_at', 'DESC' ]],
  });
};

const addReview = async (cocktailId: string, reviewData: ReviewData, userId: number) => {
  await dbConnect();

  const { rating, body, scaleComposition, scaleSpirited } = reviewData;

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

  const review = await models.rating.create({
    cocktail_id: cocktailId,
    user_id: userId,
    rating,
    body,
    scale_composition: scaleComposition,
    scale_spirited: scaleSpirited,
  });

  // @ts-ignore
  const cocktailUpdateResult = await refreshCocktailStats(review.id, +cocktailId);

  return {
    ...review.dataValues,
    cocktailUpdateStatus: cocktailUpdateResult,
  };
}

const updateReview = async (reviewId: string, reviewData: ReviewData, userId: number) => {
  await dbConnect();

  const { rating, body, scaleComposition, scaleSpirited } = reviewData;

  const updateResult = await models.rating.update({
    rating,
    body,
    scale_composition: scaleComposition,
    scale_spirited: scaleSpirited,
    updated_at: Date.now(),
    }, {
    where: {
      id: reviewId,
      user_id: userId,
    }
  });

  const cocktailUpdateResult = await refreshCocktailStats(+reviewId);

  return {
    reviewsUpdated: updateResult,
    cocktailUpdateStatus: cocktailUpdateResult,
  };
}

const deleteReview = async (reviewId: string, userId: number) => {
  await dbConnect();

  // need to grab the cocktail id before we delete the review
  const existingReview = await models.rating.findByPk(reviewId);

  if (!existingReview) {
    throw new Error('no existing review!');
  }

  // @ts-ignore
  const cocktailId = existingReview.cocktail_id;

  const destroyResult = await models.rating.destroy({
    where: {
      id: reviewId,
      user_id: userId,
    }
  });

  const cocktailUpdateResult = await refreshCocktailStats(+reviewId, cocktailId);

  return {
    reviewsDeleted: destroyResult,
    cocktailUpdateStatus: cocktailUpdateResult,
  };
}

const refreshCocktailStats = async (reviewId: number, cocktailId?: number) => {
  console.log('IN REFRESH COCKTAIL STATS');
  let finalCocktailId = cocktailId;
  if (!finalCocktailId) {
    const existingReview = await models.rating.findByPk(reviewId);

    if (!existingReview) {
      throw new Error('missing cocktail id and existing review to look up cocktail id!');
    }

    // @ts-ignore
    finalCocktailId = existingReview.cocktail_id;
  }

  const statsForCocktails = await models.rating.findAll({
    where: {
      cocktail_id: finalCocktailId,
    },
    attributes: [
      'cocktail_id',
      [Sequelize.fn('avg', Sequelize.col('rating')),'avgRating'],
      [Sequelize.fn('avg', Sequelize.col('scale_composition')),'avgComposition'],
      [Sequelize.fn('avg', Sequelize.col('scale_spirited')),'avgSpirited'],
    ],
    group: ['cocktail_id'],
  });

  console.log("UPDATING STATS FOR THE COCKTAIL! FETCHING CURRENT STATS");
  console.log(statsForCocktails);

  let statsForCocktail;
  if (statsForCocktails.length) {
    statsForCocktail = statsForCocktails[0].dataValues;
  } else {
    // if there are no stats found in the ratings table, we have deleted our only review for the cocktail, so reset everything
    statsForCocktail = {
      avgRating: -1,
      avgSpirited: null,
      avgComposition: null,
    }
  }

  const cocktailUpdate = await models.cocktail.update({
    // @ts-ignore
    avg_rating: statsForCocktail.avgRating,
    // @ts-ignore
    avg_spirited: statsForCocktail.avgSpirited,
    // @ts-ignore
    avg_composition: statsForCocktail.avgComposition,
    updated_at: Date.now(),
  }, {
    where: {
      id: finalCocktailId,
    }
  });

  return {
    rowsUpdated: cocktailUpdate,
    ...statsForCocktail,
  };
}

export default {
  getReviewsForCocktail,
  addReview,
  updateReview,
  deleteReview,
}