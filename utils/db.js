// utils/db.js
const mongoose = require('mongoose');


async function connectDB(uri) {
try {
await mongoose.connect(uri, { dbName: undefined });
console.log('[DB] MongoDB connected');
} catch (err) {
console.error('[DB] Connection error', err);
process.exit(1);
}
}


module.exports = connectDB;