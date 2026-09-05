import mariadb from "mariadb";

const pool = mariadb.createPool({

  host: process.env.DB_HOST,

  port: Number(process.env.DB_PORT),

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  ssl: {
    rejectUnauthorized: false
  },

  connectionLimit: 5,

});

export default pool;