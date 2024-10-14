const mongoose = require('mongoose');
const mondbURL = "mongodb+srv://pranavdeshmukh5454:TArntXkZb4r0sRjF@cluster0.zsfiq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster00"

const connectDb = async () => {
  try {
      await mongoose.connect(mondbURL, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB');
  } catch (error) {
      console.error('Error connecting to MongoDB:', error);
  }
};

connectDb();
module.exports = { connectDb };