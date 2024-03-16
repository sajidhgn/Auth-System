import mongoose from 'mongoose';

// const mongoURL = 'mongodb://localhost:27017/infinite_crypto_db';
// const mongoURL = 'mongodb+srv://childrensjoytime:u9MHWcWmP3ZqvjcW@clusterdb.zgswjpn.mongodb.net/gensis_db';
// const mongoURI = process.env.MONGO_URI || process.env.MONGODB_CONNECT_URI

const connectDB = async (): Promise<void> => {
    try {
        if (!process.env.MONGODB_CONNECT_URI) {
            throw new Error('MONGODB_CONNECT_URI environment variable is not defined');
        }
        
        await mongoose.connect(process.env.MONGODB_CONNECT_URI);
        console.log("Connected to MongoDB successfully");
    } catch (error:any) {
        console.log("Connection failed: " + error.message);
    }
};

export default connectDB;