
import { useEffect, useState } from 'react'
import MovieCard from './MovieCard'
import { searchMovies, getMovieDetails } from './api'

function App() {
  
  const movies = [
{
  id: 1,
  imdbID: 'tt0816692',
  title: 'Interstellar',
  year: 2014,
  rating: '8.7',
  poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
},
    {
      id: 2,
      imdbID: 'tt1375666',
      title: 'Inception',
      year: 2010,
      rating: '8.4',
      poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    },
    {
      id: 3,
      imdbID: 'tt0468569',
      title: 'The Dark Knight',
      year: 2008,
      rating: '9.0',
      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    },
    {
      id: 4,
      imdbID: 'tt15239678',
      title: 'Dune: Part Two',
      year: 2024,
      rating: '8.5',
      poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    },
  ]

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
const [page, setPage] = useState(1)
const [selectedMovie, setSelectedMovie] = useState(null)
useEffect(() => {
  function handleEscape(event) {
    if (event.key === 'Escape') {
      setSelectedMovie(null)
    }
  }

  window.addEventListener('keydown', handleEscape)

  return () => {
    window.removeEventListener('keydown', handleEscape)
  }
}, [])
const [watchlist, setWatchlist] = useState(() => {
  const savedWatchlist = localStorage.getItem('cinelog-watchlist')
  return savedWatchlist ? JSON.parse(savedWatchlist) : []
})

  useEffect(() => {
    localStorage.setItem(
      'cinelog-watchlist',
      JSON.stringify(watchlist)
    )
  }, [watchlist])
const [activeView, setActiveView] = useState('films')
  async function handleSearch(event) {
    event.preventDefault()

    if (!query.trim()) {
      setError('Please enter a movie title.')
      setSearchResults([])
      return
    }

    setLoading(true)
    setError('')
    setSearchResults([])
setPage(1)
    try {
      const results = await searchMovies(query, 1)
      setSearchResults(results)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLoadMore() {
    const nextPage = page + 1

    setLoading(true)
    setError('')

    try {
      const results = await searchMovies(query, nextPage)

      setSearchResults((previousResults) => [
        ...previousResults,
        ...results,
      ])

      setPage(nextPage)
    } catch (err) {
      setError(err.message || 'Unable to load more movies.')
    } finally {
      setLoading(false)
    }
  }

  async function handleMovieClick(movie) {
    setLoading(true)
    setError('')

    try {
      if (!movie.imdbID) {
  setError('Search for this movie by title to view its details.')
  return
}

const details = await getMovieDetails(movie.imdbID)
      setSelectedMovie(details)
    } catch (err) {
  console.error('Movie click error:', err)
  setError(err.message || 'Unable to load movie details.')
} finally {
      setLoading(false)
    }
  }

  function toggleWatchlist(movie) {
    setWatchlist((previousWatchlist) => {
      const alreadySaved = previousWatchlist.some(
        (item) => item.imdbID === movie.imdbID
      )

      if (alreadySaved) {
        return previousWatchlist.filter(
          (item) => item.imdbID !== movie.imdbID
        )
      }

      return [...previousWatchlist, movie]
    })
  }

  return (
    <div className="min-h-screen bg-[#14181c] text-white">
 
<nav className="border-b border-white/10 px-6 py-4">
  <div className="mx-auto flex max-w-6xl items-center justify-between">
<button
  type="button"
  onClick={() => {
    setActiveView('films')
    setQuery('')
    setSearchResults([])
    setPage(1)
    setError('')
  }}
  className="text-2xl font-bold tracking-tight text-[#00c030]"
>
  CineLog<span className="text-white">.</span>
</button>

    <div className="flex items-center gap-6 text-sm">
      <button
        onClick={() => setActiveView('films')}
        className={`transition hover:text-white ${
          activeView === 'films' ? 'text-[#00c030]' : 'text-gray-300'
        }`}
      >
        Films
      </button>

      <button
        onClick={() => setActiveView('watchlist')}
        className={`transition hover:text-white ${
          activeView === 'watchlist' ? 'text-[#00c030]' : 'text-gray-300'
        }`}
      >
        Watchlist ({watchlist.length})
      </button>
    </div>
  </div>
</nav>



      <main className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-3xl font-bold">
          Your next favourite film awaits.
        </h2>

        <p className="mt-3 text-gray-400">
          Discover films. Explore stories. Build your watchlist.
        </p>     
{activeView === 'films' && (
  <form
    className="mt-8 flex w-full max-w-2xl items-center gap-3"
    onSubmit={(event) => {
      if (activeView === 'watchlist') {
        event.preventDefault()
        return
      }

      handleSearch(event)
}}
>
<input
  type="text"
  value={query}
  onChange={(event) => setQuery(event.target.value)}
  placeholder="Search for a film..."
  className="w-full min-w-0 flex-1 rounded-lg border border-white/10 bg-[#202830] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-[#00c030]"
/>
<button
  type="submit"
  disabled={loading}
  className="shrink-0 rounded-lg bg-[#00c030] px-6 py-3 font-semibold text-black transition hover:bg-[#00a828] disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? 'Searching...' : 'Search'}
</button>
</form>
)}
        
        <section className="mt-12">

<h2 className="mb-6 text-xl font-bold">
  {activeView === 'watchlist'
    ? 'My Watchlist'
    : searchResults.length > 0
      ? 'Search results'
      : 'Popular picks'}
</h2>


          {loading && (
            <p className="mb-6 text-gray-400">
              Loading movies...
            </p>
          )}

          {error && (
            <p className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-300">
              {error}
            </p>
          )}

          

{!loading && !error && (
  activeView === 'watchlist' && watchlist.length === 0 ? (
    <p className="mb-6 text-gray-400">
      Your watchlist is empty. Explore films and save the ones you want to watch.
    </p>
  ) : activeView === 'films' &&
    searchResults.length === 0 && (
      <p className="mb-6 text-gray-400">
        {query.trim()
          ? `No movies found for "${query}". Try another title.`
          : 'Search for a movie to discover films.'}
      </p>
    )
)}



          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">

{(activeView === 'watchlist'
  ? watchlist
  : searchResults.length > 0
    ? searchResults
    : movies
).map((movie) => (

              <MovieCard
                key={movie.imdbID || movie.id}
                title={movie.Title || movie.title}
                year={movie.Year || movie.year}
                rating={movie.imdbRating || movie.rating}
                poster={
                  movie.Poster && movie.Poster !== 'N/A'
                    ? movie.Poster
                    : movie.poster || 'https://placehold.co/400x600/14181c/00c030?text=No+Poster'
                }
                onClick={() => handleMovieClick(movie)}
              />
            ))}
          </div>
          
          {query.trim() && searchResults.length >= 10 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-[#00c030] hover:text-[#00c030] disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div> 
          )}

        </section>
        
        {selectedMovie && (
          <div
          onClick={() => setSelectedMovie(null)} 
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4">
            <div  onClick={(event) => event.stopPropagation()} className="w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#202830] p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold text-white">
                  {selectedMovie.Title}
                </h2>

                <button
                  onClick={() => setSelectedMovie(null)}
                  className="rounded-lg px-3 py-1 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="mt-2 text-sm text-gray-400">
                {selectedMovie.Released} · {selectedMovie.Year} · {selectedMovie.Runtime}
              </p>

              <p className="mt-3 text-sm text-[#00c030]">
                {selectedMovie.Genre}
              </p>
<p className="mt-3 text-sm text-gray-400">
  <span className="text-gray-200">Director:</span>{' '}
  {selectedMovie.Director || 'Unknown'}
</p>
<p className="mt-3 text-sm text-gray-400">
  <span className="text-gray-200">Cast:</span>{' '}
  {selectedMovie.Actors || 'Not available'}
</p>
              <p className="mt-5 leading-7 text-gray-300">
                {selectedMovie.Plot}
              </p>

<div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#00c030]/30 bg-[#00c030]/10 px-3 py-2 text-[#00c030]">
  <span>★</span>
  <span className="font-semibold">
    IMDb {selectedMovie.imdbRating || 'N/A'}
  </span>
</div>
              
              <button
                onClick={() => toggleWatchlist(selectedMovie)}
                className="mt-6 rounded-lg bg-[#00c030] px-5 py-3 font-semibold text-black transition hover:bg-[#00a828]"
              >
                {watchlist.some(
                  (movie) => movie.imdbID === selectedMovie.imdbID
                )
                  ? '✓ Remove from Watchlist'
                  : '+ Add to Watchlist'}
              </button>

            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
