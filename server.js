require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const MOVIEDEX = require('./moviedex.json')


const app = express()

app.use(morgan('dev'))
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

app.get('/movie', function handleGetTypes(req, res) {
  let movies = MOVIEDEX;

  // filter our movie by genre if name query param is present
  if (req.query.genre) {
    movies = movies.filter(movie => movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }

  // filter our movie by country if country query is present
  if (req.query.country) {
    movies = movies.filter(movie => movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }

  if (req.query.avg_vote) {
    movies = movies.filter(movie => movie.avg_vote >= req.query.avg_vote);
  }

  res.json(movies);
})

const PORT = 6000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})