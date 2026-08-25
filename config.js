const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    // Your official validated MongoDB Atlas string
        MONGO_URI: process.env.MONGO_URI || "mongodb+srv://enockchepkwony88_db_user:eSQh4nZFPuHV8H6Z@clustera24.bbf1rde.mongodb.net/a24_database?retryWrites=true&w=majority&appName=ClusterA24",
            PORT: process.env.PORT || 5000
            };