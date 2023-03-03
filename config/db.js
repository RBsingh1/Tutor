const mongoose = require('mongoose'); 
// const config = require('config');
const mongoString = process.env.DATABASE_URL;

const connectDB = async () => {
    try {
      await mongoose.connect(mongoString, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useUnifiedTopology: true
      });
  
      console.log('MongoDB Connected...');
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;
