const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Ensure to replace with your actual OMDb API key
const OMDB_API_KEY = '57153c32'; 

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Hardcoded recent movies for the homepage
const recentMovies = [
  { id: 'tt8385148', title: 'Star Wars', description: 'An epic space saga.' },
  { id: 'tt4154796', title: 'Avengers: Endgame', description: 'The final battle against Thanos.' },
  { id: 'tt7286456', title: 'Joker', description: 'A chilling character study of the iconic villain.' }
];

// Render homepage with recent movies
app.get('/', (req, res) => {
  res.render('index', { recentMovies });
});

// Handle search requests
app.get('/search', async (req, res) => {
  const title = req.query.title;
  if (!title) return res.redirect('/');

  try {
    const response = await axios.get(`http://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`, {
      headers: {
        'User-Agent': 'Aetherverse Streaming App', // Custom User-Agent to mitigate some issues
        'Accept': 'application/json'
      }
    });
    const movies = response.data.Search || [];

    if (movies.length === 0) {
      return res.send('No movies found for the title. Please try another search.');
    }

    res.render('search-results', { title, movies });
  } catch (error) {
    console.error('Error occurred while searching for the movie:', error.message);
    res.send(`An error occurred while searching for the movie: ${error.message}. Please check your API key and try again.`);
  }
});

// Handle movie detail requests
app.get('/movie/:id', async (req, res) => {
  const movieId = req.params.id;
  const isTmdb = movieId.includes('tmdb');

  try {
    const response = await axios.get(`http://www.omdbapi.com/?i=${movieId}&apikey=${OMDB_API_KEY}`, {
      headers: {
        'User-Agent': 'Aetherverse Streaming App', // Custom User-Agent to mitigate some issues
        'Accept': 'application/json'
      }
    });
    const movieTitle = response.data.Title || 'Unknown Movie';
    res.render('movie', { movieId, isTmdb, movieTitle });
  } catch (error) {
    console.error('Error occurred while fetching the movie details:', error.message);
    res.render('movie', { movieId, isTmdb, movieTitle: 'Unknown Movie' });
  }
});

// Handle episode detail requests
app.get('/episode/:id', async (req, res) => {
  const episodeId = req.params.id;
  const season = req.query.s || 1;
  const episode = req.query.e || 1;
  const isTmdb = episodeId.includes('tmdb');

  try {
    const response = await axios.get(`http://www.omdbapi.com/?i=${episodeId}&apikey=${OMDB_API_KEY}`, {
      headers: {
        'User-Agent': 'Aetherverse Streaming App', // Custom User-Agent to mitigate some issues
        'Accept': 'application/json'
      }
    });
    const movieTitle = response.data.Title || 'Unknown Episode';
    res.render('episode', { episodeId, isTmdb, movieTitle, season, episode });
  } catch (error) {
    console.error('Error occurred while fetching the episode details:', error.message);
    res.render('episode', { episodeId, isTmdb, movieTitle: 'Unknown Episode', season, episode });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Aetherverse Streaming is running on http://localhost:${PORT}`);
});
