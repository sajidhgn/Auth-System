import mongoose from 'mongoose';

// const mongoURL = 'mongodb://localhost:27017/infinite_crypto_db';
const mongoURL = 'mongodb+srv://childrensjoytime:u9MHWcWmP3ZqvjcW@clusterdb.zgswjpn.mongodb.net/gensis_db';
const mongoURI = process.env.MONGO_URI || mongoURL

mongoose.connect(mongoURI);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});