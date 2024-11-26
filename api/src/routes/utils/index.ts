import { RowDataPacket } from 'mysql2';
import { connection } from '../../db';

interface genericResponse extends RowDataPacket {
  id: number;
};

const getManyByFilter = async (tableName: string, filterCriteria?: Array<string>) => {
  try {
    let whereClause = '';
    if (filterCriteria && filterCriteria.length > 0) {
      whereClause = 'WHERE ';
      filterCriteria.forEach((condition) => {
        whereClause += `${condition} AND `;
      });

      // remove the last " AND "
      whereClause = whereClause.slice(0, -5);
    }

    const [results] = await connection.query<Array<genericResponse>>(
      `SELECT * FROM ${tableName} ${whereClause}`
    );

    console.log(results);
    // console.log(fields);

    return results;
  } catch (err) {
    return "failed: " + err;
  }
};

const getOneById = async (tableName:string, id: number) => {
  try {
    const [results] = await connection.query<Array<genericResponse>>(
      `SELECT * FROM ${tableName} WHERE id=${id} LIMIT 1`
    );

    const item = results[0];

    console.log(item);
    // console.log(fields);

    return item;
  } catch (err) {
    return "failed: " + err;
  }
};

export {
  genericResponse,
  getManyByFilter,
  getOneById,
};