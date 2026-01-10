const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    f_name: {
      type: String,
      required: true,
      trim: true,
    },
    l_name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    numberOfTrips: {
      type: Number,
      default: 0,
      min: 0,
    },
    recentlyVisited: {
      type: String,
      trim: true,
    },
    placesVisited: {
      type: [String],   // <--- missing field
      default: [],
    },
    recommendations: {
      based_on_similar_age_group: { type: [String], default: [] },
      based_on_co_visitation: { type: [String], default: [] },
      based_on_same_city: { type: [String], default: [] },
    },
    recommendationsUpdatedAt: {
      type: Date,
      default: null,
    },
    googleId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);