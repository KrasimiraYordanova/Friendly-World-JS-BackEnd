const Animal = require("../models/Animal");

// home display
async function lastThreeAnimals() {
  return Animal.find({}).sort({ date: -1 }).limit(3).lean();
}

// dashboard display
async function getAllAnimals() {
  return Animal.find({}).lean();
}

// details display - dingle animal
async function getAnimalById(animalId) {
  return Animal.findById(animalId).lean();
}

// by location
async function getByLocation(search) {
  const searchReg = new RegExp(search, "i");
  return Animal.find({location: searchReg}).lean();
}

// create
async function createAnimal(animal) {
  return Animal.create(animal);
}

// edit animal
async function updateAnimalById(animalId, animal) {
  const existing = await Animal.findById(animalId);
  existing.name = animal.name;
  existing.years = animal.years;
  existing.kind = animal.kind;
  existing.image = animal.image;
  existing.need = animal.need;
  existing.location = animal.location;
  existing.description = animal.description;

  return existing.save();
}

// delete animal
async function deleteAnimalById(animal) {
  return Animal.findByIdAndDelete(animal).lean();
}

async function addDonation(animalId, userId) {
  const animal = await Animal.findById(animalId);
  animal.donations.push(userId);
  return animal.save();
}

module.exports = {
  lastThreeAnimals,
  getAllAnimals,
  getAnimalById,
  createAnimal,
  updateAnimalById,
  deleteAnimalById,
  addDonation,
  getByLocation,
};
