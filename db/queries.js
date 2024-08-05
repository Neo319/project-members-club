const pool = require("./pool");

async function insertUser(user) {
  try {
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, username, password) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [user.first_name, user.last_name, user.username, user.password]
    );
    return result.rows[0].id; // Return the newly inserted user ID
  } catch (err) {
    console.error("Error inserting user:", err);
    throw err;
  }
}

module.exports = {
  insertUser,
};
