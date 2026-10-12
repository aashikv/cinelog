
const API_KEY = import.meta.env.VITE_OMDB_API_KEY

export async function searchMovies(query, page = 1) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`
  )

  const data = await response.json()

  if (data.Response === 'False') {
    if (data.Error === 'Movie not found!') {
      return []
    }

    throw new Error(data.Error || 'Unable to find movies.')
  }

  const movies = data.Search || []

  const detailedMovies = await Promise.all(
    movies.map(async (movie) => {
      const detailResponse = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
      )

      const details = await detailResponse.json()

      return {
        ...movie,
        imdbRating:
          details.Response === 'True' && details.imdbRating !== 'N/A'
            ? details.imdbRating
            : 'N/A',
      }
    })
  )
  return detailedMovies
}

export async function getMovieDetails(imdbID) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`
  )

  const data = await response.json()

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Unable to load movie details.')
  }

  return data
}

