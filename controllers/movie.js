const Movie = require("../models/Movie");
const { errorHandler } = require('../auth');

module.exports.addMovie = (req, res) => {        
    let newMovie = new Movie({
        title : req.body.title,
        director : req.body.director,
        year : req.body.year,
        description : req.body.description,
        genre : req.body.genre,
        image : req.body.image
    });

    const year = req.body.year
    if (!/^\d{4}$/.test(year)) {
        return res.status(400).json({ message: "Invalid year." })
    }

    const image = req.body.image
    if (image) {
        const validExtensions = /\.(jpg|jpeg|png|gif|svg|webp)$/i
        if (!validExtensions.test(image)) {
            return res.status(400).json({ message: "Invalid image. Accepted extensions: .jpg, .jpeg, .png, .gif, .svg, or .webp" })
        }
    }

    Movie.findOne({ title: req.body.title })
    .then(existingMovie => {
        if(existingMovie){
            return res.status(409).send({ message: 'Movie already exists.'});
        } else {
            return newMovie.save()
            .then(result => res.status(201).send(result))
            .catch(error => errorHandler(error,req,res));
        }
    })
    .catch(error => errorHandler(error, req, res));
}; 

module.exports.getAllMovies = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    return Movie.find({})
        .then(result => {
            if (result.length > 0) {
                return res.status(200).json({ movies: result });
            } else {
                return res.status(404).json({ message: 'No movies found.' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.getMovieById = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const movieId = req.params.movieId;

    Movie.findById(movieId)
        .then(movie => {
            if (movie) {
                return res.status(200).json({ movie });
                
            } else {
                return res.status(404).json({ message: 'Movie not found.' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.updateMovie = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const updatedMovie = {
        title: req.body.title,
        director: req.body.director,
        year: req.body.year,
        description: req.body.description,
        genre: req.body.genre,
        image: req.body.image
    };

    const year = req.body.year
    if (!/^\d{4}$/.test(year)) {
        return res.status(400).json({ message: "Invalid year." })
    }

    const image = req.body.image
    if (image) {
        const validExtensions = /\.(jpg|jpeg|png|gif|svg|webp)$/i
        if (!validExtensions.test(image)) {
            return res.status(400).json({ message: "Invalid image. Accepted extensions: .jpg, .jpeg, .png, .gif, .svg, or .webp" })
        }
    }

    Movie.findByIdAndUpdate(
        req.params.movieId,
        updatedMovie,
        { new: true, runValidators: true }
    )
    .then(movie => {
        if (movie) {
            return res.status(200).json({
                message: "Movie updated successfully",
                updatedMovie: movie
            });
        } else {
            return res.status(404).json({
                message: "Movie not found"
            });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.deleteMovie = (req, res) => {
    const movieId = req.params.movieId;

    Movie.findByIdAndDelete(movieId)
        .then(movie => {
            if (movie) {
                return res.status(200).json({
                    message: "Movie deleted successfully"
                });
            } else {
                return res.status(404).json({
                    message: "Movie not found"
                });
            }
        })
        .catch(error => {
            if (error.name === 'CastError') {
                return res.status(400).json({ message: "Invalid movie ID" });
            }
            return errorHandler(error, req, res);
        });
};

module.exports.addMovieComment = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);

        if (!movie) {
            return res.status(404).send({ message: 'Movie not found' });
        }

        movie.comments.push({
            userId: req.user.id,
            comment: req.body.comment
        });

        await movie.save();

        return res.status(200).send(movie);

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports.getMovieComments = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const movieId = req.params.movieId;

    Movie.findById(movieId)
        .then(movie => {
            if (movie) {
                return res.status(200).json({ comments: movie.comments });
                
            } else {
                return res.status(404).json({ message: 'Movie not found.' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};