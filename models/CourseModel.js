const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please Add A Course title"],
    },
    description: {
      type: String,
      required: [true, "Please Add A Description"],
    },
    weeks: {
      type: String,
      required: [true, "Please Add A of weeks"],
    },
    tuition: {
      type: Number,
      required: [true, "Please Add A tuition const"],
    },
    minimumSkill: {
      type: String,
      required: [true, "Please Add A minimum skill"],
      enum: ["beginner", "intermediate", "advanced"],
    },
    scholarshipsAvailable: {
      type: Boolean,
      default: false,
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

// Course.goFish()
// const courses = Course.find();
// courses.goFish();

//Static method to get avg of course tuition ********
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log("Calculate Average Cost...".blue);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);
  console.log(obj);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (errors) {
    console.log(errors);
  }
};

//Call AverageCost After Add Course ******************
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

//Call AverageCost Before Remove Course ******************
CourseSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
