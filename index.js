const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const port = 4000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors());

//MongoDB database
mongoose.connect("mongodb+srv://admin:admin1234@acunadb.fww57qg.mongodb.net/movies_catalogue?appName=AcunaDB");

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));


//Routes Middleware
const userRoutes = require("./routes/user");
const movieRoutes = require("./routes/movie");

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);


if (require.main === module) {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`API is now online on port ${process.env.PORT || 4000}`);
    });
}

module.exports = {app,mongoose};