const {
  createAnimal,
  getAnimalById,
  deleteAnimalById,
  updateAnimalById,
  addDonation,
} = require("../services/animalService");
const { parseError } = require("../utils/parser");
const { hasUser } = require('../middlewares/guards');

animalController = require("express").Router();

// create dispay - get
animalController.get("/create", hasUser(), (req, res) => {
  res.render("create", {
    title: "Create Animal",
  });
});

// details display - single animal
animalController.get("/:id", async (req, res) => {
  const animal = await getAnimalById(req.params.id);

  animal.isOwner = req.user && req.user._id == animal.owner;
  animal.hasDonated = animal.donations
    .map((x) => x.toString())
    .includes(req.user?._id.toString());

  res.render("details", {
    title: animal.name,
    animal,
  });
});

//  delete animal
animalController.get("/:id/delete", hasUser(), async (req, res) => {
  const animal = await getAnimalById(req.params.id);

  if (animal.owner.toString() != req.user._id.toString()) {
    return res.redirect("/login");
  }

  await deleteAnimalById(req.params.id);
  res.redirect("/");
});

// create - post
animalController.post("/create", hasUser(), async (req, res) => {
  const animal = {
    name: req.body.name,
    years: req.body.years,
    kind: req.body.kind,
    image: req.body.image,
    need: req.body.need,
    location: req.body.location,
    description: req.body.description,
    owner: req.user._id,
  };
  try {
    await createAnimal(animal);
    res.redirect("/");
  } catch (error) {
    const errors = parseError(error);
    res.render("create", {
      title: "Create Animal",
      errors,
      body: animal,
    });
  }
});

animalController.get("/:id/edit", hasUser(), async (req, res) => {
  const animal = await getAnimalById(req.params.id);
  console.log(animal);

  if (animal.owner.toString() != req.user._id.toString()) {
    return res.redirect("/");
  }
  res.render("edit", {
    title: "Edit animal",
    animal,
  });
});

animalController.post("/:id/edit", hasUser(), async (req, res) => {
  const animal = await getAnimalById(req.params.id);

  const animalNew = {
    name: req.body.name,
    years: req.body.years,
    kind: req.body.kind,
    image: req.body.image,
    need: req.body.need,
    location: req.body.location,
    description: req.body.description,
  };

  if (animal.owner.toString() != req.user._id.toString()) {
    return res.redirect("/login");
  }

  try {
    await updateAnimalById(req.params.id, animalNew);
    res.redirect(`/animal/${req.params.id}`);
  } catch (error) {
    res.render("edit", {
      title: "Edit animal",
      animal: req.body,
      errors: parseError(error),
    });
  }
});

animalController.get("/:id/donate", hasUser(), async (req, res) => {
    const animal = await getAnimalById(req.params.id);
  
    if (
      req.user._id.toString() != animal.owner.toString() &&
      animal.donations
        .map((donor) => donor.toString())
        .includes(req.user._id.toString()) == false
    ) {
      await addDonation(req.params.id, req.user._id);
    }
    return res.redirect(`/animal/${req.params.id}`);
  });

module.exports = animalController;
