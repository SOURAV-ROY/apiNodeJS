const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.set('strictPopulate', false);
const connectDB = async () => {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected : ${connect.connection.host}`.yellow.underline.bold);
}

module.exports = connectDB;
