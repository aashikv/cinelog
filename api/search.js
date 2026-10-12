
export default async function handler(req, res) {
  const { q, page = '1', id } = req.query
  const apiKey = process.env.OMDB_API_KEY

  if (!apiKey) {
    return res.status(500).json({ Error: 'API key is not configured.' })
  }

  if (!q && !id) {
    return res.status(400).json({ Error: 'Provide a movie title or IMDb ID.' })
  }

  try {
    const params = new URLSearchParams({
      apikey: apiKey,
      ...(q ? { s: q, page: String(page) } : { i: id, plot: 'full' }),
    })

    const response = await fetch(`https://www.omdbapi.com/?${params}`)
    const data = await response.json()

    return res.status(200).json(data)
  } catch {
    return res.status(502).json({ Error: 'Unable to reach the movie service.' })
  }
}
