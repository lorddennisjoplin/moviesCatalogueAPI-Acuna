const express = require("express");
const movieController = require("../controllers/movie");
const auth = require('../auth');
const { verify, verifyAdmin } = auth;
const router = express.Router();

router.post("/addMovie", verify, verifyAdmin, movieController.addMovie); 
router.get("/getMovies", verify, movieController.getAllMovies);
router.get("/getMovie/:movieId", verify, movieController.getMovieById);
router.patch("/updateMovie/:movieId", verify, verifyAdmin, movieController.updateMovie);
router.delete("/deleteMovie/:movieId", verify, verifyAdmin, movieController.deleteMovie);
router.post("/addComment/:movieId", verify, movieController.addMovieComment);
router.get("/getComments/:movieId", verify, movieController.getMovieComments);

module.exports = router;