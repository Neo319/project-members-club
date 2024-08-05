const pool = require("./pool");

async function insertUser(user) {
  try {
    await pool.query(`INSERT INTO users VALUES ($1, $2, $3, $4, $5)`, [
      user.first_name,
      user.last_name,
      user.username,
      user.password,
      user.membership_status,
      user.admin,
    ]);
  } catch (err) {
    console.error("error inserting user", err);
    throw err;
  }
}

module.exports = {
  insertUser,
};
