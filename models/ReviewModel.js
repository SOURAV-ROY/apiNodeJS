const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please Add A Title for a review"],
      maxlength: 100,
    },
    text: {
      type: String,
      required: [true, "Please Add Some Text"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, "Please Add A Rating between 1 and 10"],
    },
    bootcamp: {
      type: mongoose.Schema.ObjectId,
      ref: "Bootcamp",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Prevent user from submitting more than one review per bootcamp ******
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

//Static method to get avg rating and save  ********
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  console.log("Calculate Average Rating...".rainbow.bold);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  console.log(obj);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      // averageRating: obj[0].averageRating
      averageRating:
        Math.round((obj[0].averageRating + Number.EPSILON) * 1000) / 1000,
    });
  } catch (errors) {
    console.log(errors);
  }
};

//Call AverageCost After Add Course **********************
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

//Call AverageCost Before Remove Course ******************
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);
