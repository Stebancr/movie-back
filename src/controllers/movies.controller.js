import { db } from "../services/firebase.js";

// ----------------------------------
// 👉 1. Agregar película
// ----------------------------------
export const addMovie = async (req, res) => {
  try {
    const { title, genre, description } = req.body;

    if (!title || !genre)
      return res.status(400).json({ message: "Missing fields" });

    const movie = {
      title,
      genre,
      description: description || "",
      average_rating: 0,
      rating_count: 0,
      created_at: new Date()
    };

    const ref = await db.collection("movies").add(movie);

    res.status(201).json({ id: ref.id, ...movie });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ----------------------------------
// 👉 2. Listar todas las películas
// ----------------------------------
export const getMovies = async (req, res) => {
  try {
    const snapshot = await db.collection("movies").get();
    const movies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.json(movies);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ----------------------------------
// 👉 3. Filtrar por género
// ----------------------------------
export const getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;

    const snapshot = await db
      .collection("movies")
      .where("genre", "==", genre)
      .get();

    const movies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json(movies);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ----------------------------------
// 👉 4. Calificar una película
// ----------------------------------
export const rateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { uid, rating } = req.body;

    if (!uid)
      return res.status(400).json({ message: "Missing user ID (uid)" });

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: "Rating must be 1-5" });

    // 1. Verificar si ya calificó
    const rateId = `${movieId}_${uid}`;
    const rateRef = db.collection("ratings").doc(rateId);
    const existingRate = await rateRef.get();

    if (existingRate.exists) {
      return res.status(400).json({ message: "User already rated this movie" });
    }

    // 2. Guardar calificación
    await rateRef.set({
      movieId,
      uid,
      rating,
      date: new Date()
    });

    // 3. Actualizar promedio
    const movieRef = db.collection("movies").doc(movieId);
    const movieDoc = await movieRef.get();

    if (!movieDoc.exists)
      return res.status(404).json({ message: "Movie not found" });

    const data = movieDoc.data();

    const newRatingCount = data.rating_count + 1;
    const newAverage = ((data.average_rating * data.rating_count) + rating) / newRatingCount;

    await movieRef.update({
      average_rating: newAverage,
      rating_count: newRatingCount
    });

    res.json({
      message: "Rating added",
      new_average: newAverage,
      rating_count: newRatingCount
    });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

