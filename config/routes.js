const animalController = require("../controllers/animalController");
const homeController = require("../controllers/homeController");
const notFoundController = require('../controllers/notFoundController');

function routers(app) {
  app.use("/", homeController);
  app.use("/animal", animalController);
  app.use('/*', notFoundController);
}

module.exports = routers;
