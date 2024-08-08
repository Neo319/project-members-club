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

async function addMembership(user, isAdmin) {
  try {
    if (isAdmin) {
      await pool.query(
        `UPDATE USERS SET admin = true, membership_status = true WHERE id = $1`,
        [user.id]
      );
    } else {
      await pool.query(
        `UPDATE USERS SET membership_status = true WHERE id = $1`,
        [user.id]
      );
    }
  } catch (err) {
    console.error("Error adding member:", err);
    throw err;
  }
}

// ------ render messages ------

async function getMessages() {
  try {
    const { rows } = await pool.query(
      `SELECT message, date, first_name FROM messages
      INNER JOIN users ON messages.poster_id = users.id`
    );

    return rows;
  } catch (err) {
    console.error("error rendering messages", err);
    throw err;
  }
}

async function postMessage(message) {
  try {
    await pool.query(
      `INSERT INTO messages (message, poster_id) VALUES ($1, $2)`,
      [message.message, message.poster_id]
    );
  } catch (err) {
    console.error("error inserting message", err);
    throw err;
  }
}

module.exports = {
  insertUser,
  addMembership,
  getMessages,
  postMessage,
};
