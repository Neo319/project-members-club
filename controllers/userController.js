const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const db = require("../db/queries");
const passport = require("passport");

//secret
const PASSCODE = process.env.PASSCODE;

// --- render homepage on GET. ---
exports.index_get = asyncHandler((req, res, next) => {
  res.render("index", {
    title: "Project Members Club",
    user: req.user || null,
  });
});

// --- render sign-up page on GET. ---
exports.sign_up_get = asyncHandler((req, res, next) => {
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
exports.login_get = (req, res, next) => {
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
exports.logout_get = (req, res, next) => {
  res.render("index", {
    title: "Project Members Club",
    user: null,
  });
};

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

  asyncHandler(async (req, res, next) => {
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
          console.log(user);

          await db.addMembership(user);
          console.log("added membership!");
          res.redirect("/");
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
