const mongoose = require('mongoose');
const slugify = require('slugify');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Add Name"],
        unique: true,
        trim: true,
        maxlength: [50, "name can not be more than 50 characters"]
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please Add Description"],
        maxlength: [500, "Description can not be more than 500 characters"]
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please use a valid URL with HTTP or HTTPS"
        ]
    },
    phone: {
        type: String,
        maxlength: [20, "Phone number can not be more than 20 characters"]
    },
    email: {
        type: String,
        match: [
            /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
            "Please add a valid email"
        ]
    },
    address: {
        type: String,
        required: [true, "Please Add Address"],
    },
    // location: {
    //     //GeoJSON Point *************************
    //     type: {
    //         type: String, // Don't do `{ location: { type: String } }`
    //         enum: ['Point'], // 'location.type' must be 'Point'
    //         required: true
    //     },
    //     coordinates: {
    //         type: [Number],
    //         required: true,
    //         index: '2dsphere'
    //     },
    //     formattedAddress: String,
    //     street: String,
    //     city: String,
    //     state: String,
    //     zipcode: String,
    //     country: String,
    // },
    careers: {
        //Array of string **************
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must be can not be more than 10'],
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }

});

BootcampSchema.pre('save', function (next) {

    this.slug = slugify(this.name, {lower: true});

    console.log("Slugify RAN ->>> ", this.name);

    next();
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
