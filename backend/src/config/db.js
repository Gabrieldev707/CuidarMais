const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 15000,
        autoIndex: process.env.NODE_ENV !== 'production'
    });
    console.log('MongoDB Atlas conectado com sucesso');
};

module.exports = connectDB;
