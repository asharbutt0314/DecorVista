import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function dropIndex() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // Drop the old unique index on username
    await collection.dropIndex('username_1');
    console.log('Dropped username_1 index successfully');
    
    // Create new compound indexes
    await collection.createIndex({ email: 1, role: 1 }, { unique: true });
    await collection.createIndex({ username: 1, role: 1 }, { unique: true });
    console.log('Created new compound indexes');
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    process.exit(1);
  }
}

dropIndex();