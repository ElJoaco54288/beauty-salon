// src/db.js
import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: 'bfj6ydg5ndx75lxre8w1-mysql.services.clever-cloud.com',
  port: 3306,
  user: 'uowm0xcz6qmh2khv',
  password: 'kLsrl4nJXY9xtdoU6diV',
  database: 'bfj6ydg5ndx75lxre8w1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
