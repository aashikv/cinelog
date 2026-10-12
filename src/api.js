
async function requestMovies(params) {
  const query = new URLSearchParams(params)
  const response = await fetch(`/api/search?${query}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.Error || 'Unable to contact the movie service.')
  }

  return data
}

export async function searchMovies(query, page = 1) {
  const data = await requestMovies({ q: query, page })

  if (data.Response === 'False') {
    if (data.Error === 'Movie not found!') {
      return []
    }

    throw new Error(data.Error || 'Unable to find movies.')
  }

  const movies = data.Search || []

  const detailedMovies = await Promise.all(
    movies.map(async (movie) => {
      try {
        const details = await requestMovies({ id: movie.imdbID })

        return {
          ...movie,
          imdbRating:
            details.Response === 'True' && details.imdbRating !== 'N/A'
              ? details.imdbRating
              : 'N/A',
        }
      } catch {
        return { ...movie, imdbRating: 'N/A' }
      }
    })
  )

  return detailedMovies
}

export async function getMovieDetails(imdbID) {
  const data = await requestMovies({ id: imdbID })

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Unable to load movie details.')
  }

  return data
}
