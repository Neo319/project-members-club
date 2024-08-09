const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const db = require("../db/queries");
const passport = require("passport");

//secret
const PASSCODE = process.env.PASSCODE;

// --- render homepage on GET. ---
exports.index_get = asyncHandler(async (req, res) => {
  const messagesResult = await db.getMessages();

  res.render("index", {
    title: "Project Members Club",
    user: req.user || null,
    messages: messagesResult,
  });
});

// --- render sign-up page on GET. ---
exports.sign_up_get = asyncHandler((req, res) => {
  res.render("sign-up-form", { title: "Join the Club" });
});

// --- POST new user to database. ---
exports.sign_up_post = [
  //validate & sanitize
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters")
    .escape(),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters")
    .escape(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password must not be empty")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .escape(),

  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage("Password must not be empty")
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm password must match the password");
      }
      return true;
    }),

  //asynchronously sign up to db if valid
  async function (req, res, next) {
    //ensure no errors
    const errors = validationResult(req);
    if (errors.length) {
      throw new Error("Error creating new user", errors);
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log("bcrypt error");
        return next(err);
      }

      try {
        const user = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
        };
        const result = await db.insertUser(user);
        res.redirect("/");
      } catch (err) {
        return next(err);
      }
    });
  },
];

// --- Login page GET. ---
exports.login_get = (req, res) => {
  res.render("login", { title: "Log In" });
};

// --- POST login request. ---
exports.login_post = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect("/login"); // Redirect to login if authentication fails
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/"); // Redirect to home or intended page on success
    });
  })(req, res, next); // Important to call this function with req, res, next
};

// --- Logout GET. ---
exports.logout_get = asyncHandler(async (req, res, next) => {
  const messagesResult = await db.getMessages();

  res.render("index", {
    title: "Project Members Club",
    user: null,
    messages: messagesResult,
  });
});

// --- Membership form GET. ---
exports.membership_get = (req, res, next) => {
  res.render("membership_form", {
    title: "Become a Member",
    user: req.user || null,
  });
};

// --- POST Membership form. ---
exports.membership_post = [
  //validate and sanitize
  body("passcode").trim().escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (errors.length) {
      //checking that there was no error
      console.log("errors found:");
      console.log(errors.array());
      res.redirect("/membership");
    } else {
      //checking that the code is correct
      console.log("code expected : " + PASSCODE);
      console.log("code recieved : " + req.body.code);
      if (req.body.code === PASSCODE) {
        console.log("code is correct");
        console.log("validation PASSED");

        //update membership status
        //addMembership(user)

        try {
          const user = req.user;

          const isAdmin = req.body.admin;
          console.log(typeof isAdmin);
          console.log(isAdmin);

          console.log(user);

          await db.addMembership(user, isAdmin);
          console.log("added membership!");
          res.redirect("/");

          //error handling
        } catch (err) {
          console.error("error adding membership", err);
          throw err;
        }
      }
      console.log("validation complete");

      res.redirect("/membership");
    }
  }),
];

// retrieve message form on GET.
exports.message_get = function (req, res) {
  res.render("message", { title: "Create New Message", user: req.user });
};

// POST new messages.
exports.message_post = [
  body("message").trim().escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.error("error posting message.", errors.array());
      return false;
    }

    // no errors: post message to db

    const message = {
      message: req.body.message,
      poster_id: req.user.id,
    };

    await db.postMessage(message);
    res.redirect("/");
  }),
];

// DELETE messages from message board
exports.index_delete = asyncHandler(async (req, res) => {
  const messageId = req.params.id;

  console.log(messageId + " is to be deleted");
  // await db.deleteMessage(messageId);

  res.redirect("/");
});
