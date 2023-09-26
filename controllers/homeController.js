const { register, login } = require("../services/userService");
const { parseError } = require("../utils/parser");
const { body, validationResult } = require("express-validator");
const { isGuest } = require("../middlewares/guards");
const {
  lastThreeAnimals,
  getAllAnimals,
  getByLocation,
} = require("../services/animalService");

const homeController = require("express").Router();

// homepage display
homeController.get("/", async (req, res) => {
  const animals = await lastThreeAnimals();
  res.render("home", {
    title: "Home",
    animals,
  });
});

//  dashboard display
homeController.get("/dashboard", async (req, res) => {
  const animals = await getAllAnimals();
  res.render("dashboard", {
    title: "Dshboard",
    animals,
  });
});

// search
homeController.get("/search", async (req, res) => {
  animals = await getByLocation(req.query.search);
  res.render("search", {
    animals,
  });
});

homeController.get("/register", isGuest(), (req, res) => {
  res.render("register", {
    title: "Register Page",
  });
});

homeController.post(
  "/register",
  isGuest(),
  body("email")
    .isEmail()
    .isLength({ min: 10 })
    .withMessage("Email must be at least 10 characters long"),
  body("pass")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),
  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      if (errors.length > 0) {
        throw errors;
      }
      if (req.body.repass != req.body.pass) {
        throw new Error("Passwords don't match");
      }
      const token = await register(req.body.email, req.body.pass);
      res.cookie("token", token);
      res.redirect("/");
    } catch (error) {
      const errors = parseError(error);
      res.render("register", {
        title: "Register Page",
        errors,
        body: {
          username: req.body.username,
        },
      });
    }
  }
);

homeController.get("/login", isGuest(), (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

homeController.post("/login", isGuest(), async (req, res) => {
  try {
    if (req.body.email == "" || req.body.pass == "") {
      throw new Error("All fields are required");
    }
    const token = await login(req.body.email, req.body.pass);
    res.cookie("token", token);
    res.redirect("/");
  } catch (error) {
    const errors = parseError(error);
    res.render("login", {
      title: "Login Page",
      errors,
      body: {
        email: req.body.email,
      },
    });
  }
});

homeController.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = homeController;
