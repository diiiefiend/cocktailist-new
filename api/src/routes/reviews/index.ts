import { dbConnect, models } from '../../db';

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


export default {
  getReviewsForCocktail,
}