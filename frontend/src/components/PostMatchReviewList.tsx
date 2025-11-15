import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type MatchSummary = {
  id: string
  date: string
  season: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  competition?: string
}

// Mock data - replace with real API data as needed
const SEASONS = ['23/24', '24/25', '25/26']
const MOCK_MATCHES: MatchSummary[] = Array.from({ length: 37 }).map((_, i) => ({
  id: `${i + 1}`,
  date: `2025-11-${(i % 30) + 1}`,
  season: SEASONS[i % SEASONS.length],
  homeTeam: i % 2 === 0 ? 'Manchester City' : 'Arsenal',
  awayTeam: i % 2 === 0 ? 'Arsenal' : 'Manchester City',
  homeScore: Math.floor(Math.random() * 5),
  awayScore: Math.floor(Math.random() * 5),
  competition: 'Premier League',
}))

const PAGE_SIZES = [10, 20, 50]

const PostMatchReviewList: React.FC = () => {
  const navigate = useNavigate()
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(1)
  const [season, setSeason] = useState<string>('All')
  const [teamQuery, setTeamQuery] = useState<string>('')
  const [dateFilter, setDateFilter] = useState<string>('') // YYYY-MM-DD from <input type="date" />

  // seasons are fixed to the SEASONS constant (plus 'All')
  const seasons = useMemo(() => ['All', ...SEASONS], [])

  // helper to normalize match date to YYYY-MM-DD so it compares reliably with date input
  function normalizeDateString(raw: string) {
    const d = new Date(raw)
    if (isNaN(d.getTime())) return ''
    return d.toISOString().slice(0, 10)
  }

  const filtered = useMemo(() => {
    const q = teamQuery.trim().toLowerCase()
    return MOCK_MATCHES.filter(m => {
      // season filter
      if (season !== 'All' && m.season !== season) return false

      // team name filter (search both home and away)
      if (q) {
        const home = m.homeTeam.toLowerCase()
        const away = m.awayTeam.toLowerCase()
        if (!home.includes(q) && !away.includes(q)) return false
      }

      // date filter (compare normalized YYYY-MM-DD)
      if (dateFilter) {
        const md = normalizeDateString(m.date)
        if (!md || md !== dateFilter) return false
      }

      // competition is fixed to Premier League in this dataset
      return true
    })
  }, [season, teamQuery, dateFilter])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const current = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [page, pageSize, filtered])

  function openDetail(m: MatchSummary) {
    navigate(`/postmatch/${m.id}`)
  }

  function clearFilters() {
    setSeason('All')
    setTeamQuery('')
    setDateFilter('')
    setPage(1)
  }

  return (
    <div className="p-4 overflow-x-auto bg-white/90 rounded-xl shadow-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/60 bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
        <h2 className="text-2xl font-bold">Post Match Reviews</h2>
        <p className="text-sm text-indigo-100/80">Recent match results and detailed post-match reports</p>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Show</span>
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
                className="border rounded px-2 py-1 text-sm"
              >
                {PAGE_SIZES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <span className="text-gray-600">entries</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600">Season</span>
              <select value={season} onChange={e => { setSeason(e.target.value); setPage(1) }} className="border rounded px-2 py-1 text-sm">
                {seasons.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600">Team</span>
              <input
                type="text"
                placeholder="Search team name..."
                value={teamQuery}
                onChange={e => { setTeamQuery(e.target.value); setPage(1) }}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600">Date</span>
              <input
                type="date"
                value={dateFilter}
                onChange={e => { setDateFilter(e.target.value); setPage(1) }}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>

            <button onClick={clearFilters} className="text-sm px-3 py-1 bg-gray-100 rounded">Clear</button>

          </div>

          <div className="text-sm text-gray-600">Total: {total} matches</div>
        </div>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 uppercase">
              <th className="px-4 py-2 w-10">#</th>
              <th className="px-4 py-2 text-left">Match</th>
              <th className="px-2 py-2">Score</th>
              <th className="px-2 py-2">Date</th>
              <th className="px-2 py-2">Competition</th>
            </tr>
          </thead>
          <tbody>
            {current.map((m, idx) => (
              <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => openDetail(m)}>
                <td className="px-3 py-3 align-middle">{(page - 1) * pageSize + idx + 1}</td>
                <td className="px-3 py-3 text-left">
                  <div className="flex items-center gap-4">
                    <div className="font-semibold">{m.homeTeam}</div>
                    <div className="text-xs text-gray-500">vs</div>
                    <div className="font-semibold">{m.awayTeam}</div>
                  </div>
                </td>
                <td className="px-3 py-3 font-bold">{m.homeScore} - {m.awayScore}</td>
                <td className="px-3 py-3 text-gray-600">{normalizeDateString(m.date) || m.date}</td>
                <td className="px-3 py-3 text-gray-600">{m.competition}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Page {page} / {totalPages}</div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
            >Prev</button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
            >Next</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default PostMatchReviewList
