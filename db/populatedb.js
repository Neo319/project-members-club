//this script is responsible for populating the database on production.

//must be run while passing in the database connection string as an argument!

const { Client } = require("pg");

// --- create tables/schemas ---
const users = `CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(255),
	last_name VARCHAR(255),
	username VARCHAR(255),
	password TEXT,
	membership_status BOOLEAN DEFAULT FALSE,
	admin BOOLEAN DEFAULT FALSE
)`;

const messages = `CREATE TABLE IF NOT EXISTS messages (
	id SERIAL PRIMARY KEY,
	poster_id INTEGER,
	message TEXT,
	date DATE DEFAULT CURRENT_DATE
);`;

// --- add sample data ---
const populateUser = `INSERT INTO users (first_name, last_name, username, password, membership_status, admin) VALUES (
	'Daniel',
	'Johnson',
	'dj@mail.com',
	'pass',
	false,
	false
);`;

const populateMessage = `INSERT INTO messages (poster_id, message) VALUES (
	1,
	'This is a test message'
);`;

// execution
async function main() {
  console.log("seeding...");
  console.log(process.argv[0]);
  const client = new Client({
    connectionString: process.argv[2],
  });

  try {
    await client.connect();
    console.log("Connected to the database");

    await client.query(users);
    console.log("Users table created");

    await client.query(messages);
    console.log("message table created");

    await client.query(populateUser);
    console.log("User populated");

    await client.query(populateMessage);
    console.log("Message populated");
  } catch (error) {
    console.error("Error executing queries:", error);
  } finally {
    await client.end();
    console.log("done");
  }
}

main();
