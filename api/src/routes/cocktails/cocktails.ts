import mysql from 'mysql2/promise';

const getCocktails = async () => {
  // Create the connection to database
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'cocktailist',
  });

  try {
    const [results, fields] = await connection.query(
      'SELECT * FROM cocktails LIMIT 10'
    );

    console.log(results);
    console.log(fields);

    return {
      results,
      fields,
    };
  } catch (err) {
    return "failed: " + err;
  }
};

export default {
  getCocktails,
}