# Personal Portfolio Project- Members' Club

## Table of Contents

- [Description](#description)
- [Deployment](#deployment)
- [Usage](#usage)
- [Technologies used](#technologies-used)
- [Contributing and Contact](#contributing-and-contact)

# Description

This is a personal portfolio project built as a monorepo. It is a solution to the ['Members Only' project](https://www.theodinproject.com/lessons/node-path-nodejs-members-only) from [The Odin Project](https://www.theodinproject.com) curriculum.

It is primarily intended to practice the use of databases for storing users and messages in a website, with a specific focus on creating users with varying levels of permisisons and statuses.

## Deployment

## Usage

In this project, a user who is not logged in will not see anything but the messages that have been posted by all users on the website. If they are logged in, they will be able to 'become a member' by inputting a secret passcode ("sesame") which adds a membership to their user object stored in the database. Only members will be able to see who posted the messages and when they were posted. Further, only Admin users are given permission to delete messages from the database.

While this project is small-scale and simple, it is intended to practice database manipulation using PostgreSQL queries.

This project uses Express as its foundation, with EJS views. Passport and bcrpytJS are used for authentication. Express-validator is used for data sanitization of users who sign up.

## Technologies used

- Express
- PostgreSQL
- Javascript, HTML

## Contributing and contact

Contributions are welcome -- feel free to start a pull request for any concerns or questions.

Also contact me at:

- email: alexmnevins@gmail.com
- LinkedIn:[Alex Nevins](https://www.linkedin.com/in/alex-nevins-489488282/)
