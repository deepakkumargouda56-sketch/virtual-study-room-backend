import pool from "../config/database";

interface User {
  name: string;
  email: string;
  password: string;
}

export const createUser = async (user: User) => {
  const { name, email, password } = user;

  const conn = await pool.getConnection();

  try {
    const result = await conn.query(
      `INSERT INTO users (name, email, password)
       VALUES (?, ?, ?)`,
      [name, email, password]
    );

    return result;
  } finally {
    conn.release();
  }
};

export const findUserByEmail = async (email: string) => {

  
  const conn = await pool.getConnection();

  try {
    const rows = await conn.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    return rows[0] || null;
  } finally {
    conn.release();
  }
};


export const getUserById = async (id: number) => {
  const conn = await pool.getConnection();

  try {
    const rows = await conn.query(
      `SELECT
        id,
        name,
        email,
        created_at
      FROM users
      WHERE id = ?`,
      [id]
    );

    return rows[0] || null;
  } finally {
    conn.release();
  }
};