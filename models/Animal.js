const { Schema, model, Types } = require("mongoose");

const URL_PATTERN = /https?:\/\/./i;

const animalSchema = new Schema({
  name: {
    type: String,
    minlength: [2, "The description should be min 2 characters long"],
  },
  years: { type: Number, required: [true, 'Age must be provided'], min: [1, 'Age can be min 1'], max: [100, 'Age can be max 100'] },
  kind: {
    type: String,
    minlength: [3, "The description should be min 3 characters long"],
  },
  image: {
    type: String,
    validate: {
      validator: (value) => URL_PATTERN.test(value),
      message: "Invalid URL",
    },
  },
  need: { type: String, required: true, minlength: [3, "The description should be min 5 characters long"], maxlength: [20, "The description should be min 50 characters long"] },
  location: { type: String, required:true , minlength: [5, "The description should be min 5 characters long"], maxlength: [15, "The description should be min 50 characters long"] },
  description: { type: String, required: true, minlength: [5, "The description should be min 5 characters long"], maxlength: [50, "The description should be min 50 characters long"] },
  donations: { type: [Types.ObjectId], ref: "User", default: [] },
  owner: { type: Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
});

const Animal = model("Animal", animalSchema);
module.exports = Animal;
