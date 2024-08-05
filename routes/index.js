var express = require("express");
var router = express.Router();

const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const userController = require("../controllers/userController");

// --- routes ---
router.get("/", userController.index_get);

router.get("/sign-up", userController.sign_up_get);

router.post("/sign-up", userController.sign_up_post);

router.get("/login", userController.login_get);

router.post("/login", userController.login_post);

router.get("/logout", userController.logout_get);

router.get("/membership", userController.membership_get);

module.exports = router;
