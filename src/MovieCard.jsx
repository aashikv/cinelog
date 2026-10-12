function MovieCard({ title, year, rating, poster, onClick }) {
  return (
<button
  onClick={onClick}
  type="button"
  className="group block w-full cursor-pointer overflow-hidden rounded-xl bg-[#202830] text-left transition duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00c030]"
>
      <div className="aspect-[2/3] overflow-hidden bg-[#29313a]">
        <img
          src={poster}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-3">
        <h3 className="truncate font-semibold text-white">
          {title}
        </h3>

        <div className="mt-2 flex items-center justify-between text-sm text-gray-400">
          <span>{year}</span>
          <span>★ {rating || 'N/A'}</span>
        </div>
      </div>
    </button>
  )
}

export default MovieCard
