import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { teams } from '../data/teams'

type Player = {
  number: number
  name: string
  position: 'GK' | 'DF' | 'MID' | 'FW' | 'SUB'
  nationality?: string
}

const TeamDetail: React.FC = () => {
  const { name } = useParams()
  const decodedName = name ? decodeURIComponent(name) : ''
  const team = teams.find(t => t.name === decodedName)

  if (!team) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold">Team not found</h2>
        <Link to="/">Back</Link>
      </div>
    )
  }

  // simple manager mapping for demonstration
  const managers: Record<string, string> = {
    'Manchester City': 'Pep Guardiola',
    'Arsenal': 'Mikel Arteta',
    'Liverpool': 'Jürgen Klopp',
    'Chelsea': 'Enzo Maresca',
    'Manchester United': 'Erik ten Hag',
  }

  // generate a plausible squad for display
  const squad: Player[] = Array.from({ length: 20 }).map((_, i) => {
    const number = i + 1
    let position: Player['position'] = 'SUB'
    if (i === 0) position = 'GK'
    else if (i >= 1 && i <= 4) position = 'DF'
    else if (i >= 5 && i <= 11) position = 'MID'
    else if (i >= 12 && i <= 15) position = 'FW'

    return {
      number,
      name: `${team.name} Player ${number}`,
      position,
      nationality: ['ENG', 'ESP', 'FRA', 'POR', 'BRA'][number % 5],
    }
  })

  const starters = squad.slice(0, 11)

  return (
    <div className="p-6 bg-white/90 rounded-xl shadow-2xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="px-6 py-4 border-b border-white/60 bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-md mb-4">
            <div className="flex items-center gap-4">
              <img src={team.logo} alt={team.name} className="w-20 h-20 object-contain" />
              <div>
                <h2 className="text-2xl font-bold">{team.name}</h2>
                <div className="text-sm text-indigo-100/80">Stadium: Example Stadium</div>
                <div className="text-sm text-indigo-100/80 mt-1">Manager: {managers[team.name] ?? 'Head Coach'}</div>
              </div>
            </div>
          </div>

          <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2">直近の試合の結果</h3>
            <div className="bg-white rounded-md shadow p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={team.logo} alt="" className="w-12 h-12" />
                  <div>
                    <div className="font-semibold">{team.name} 2 - 1 Opponent</div>
                    <div className="text-sm text-gray-500">2025-11-14</div>
                    <div className="text-xs text-gray-500">Scorers: Player 9 (2), Player 11 (1)</div>
                  </div>
                </div>
                <div className="text-green-700 font-bold">Win</div>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2">直近5試合の結果</h3>
            <div className="flex gap-2">
              {team.form.map((f, i) => (
                <div key={i} className={`px-3 py-2 rounded text-white font-semibold ${f === 'W' ? 'bg-green-600' : f === 'D' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                  {f}
                </div>
              ))}
            </div>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2">直近のスタメン</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 bg-white rounded-md p-3">
              {starters.map(p => (
                <div key={p.number} className="p-3 bg-gray-50 rounded flex flex-col items-start">
                  <div className="flex items-center justify-between w-full">
                    <div className="text-sm text-gray-500">#{p.number}</div>
                    <div className={`text-xs font-semibold px-2 py-1 rounded ${p.position === 'GK' ? 'bg-indigo-100 text-indigo-700' : p.position === 'DF' ? 'bg-sky-100 text-sky-700' : p.position === 'MID' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{p.position}</div>
                  </div>
                  <div className="mt-2 font-semibold">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.nationality}</div>
                  <div className="text-xs text-gray-500 mt-2">Status: Starting XI</div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">最新ニュース</h4>
              <div className="bg-white rounded-md shadow p-4">
                <div className="text-sm text-gray-700 font-semibold">{team.name} makes strategic signing</div>
                <div className="text-xs text-gray-500 mt-1">Club has announced the signing of a young talent to strengthen the squad ahead of the season.</div>
                <div className="mt-3 text-sm">
                  <a className="text-indigo-600 hover:underline">Read more →</a>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">メンバー表</h3>
            <div className="bg-white rounded-md p-3">
              <ul className="space-y-2 text-sm">
                {squad.map(p => (
                  <li key={p.number} className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-gray-500">#{p.number} • {p.position} • {p.nationality}</div>
                    </div>
                    <div className="text-xs text-gray-500">{p.position}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">順位表</h3>
            <div className="bg-white rounded-md p-2">
              <table className="w-full text-sm">
                <tbody>
                  {teams.map(t => (
                    <tr key={t.pos} className={`py-1 ${t.name === team.name ? 'bg-indigo-50' : ''}`}>
                      <td className="px-2 py-1 font-bold w-6">{t.pos}</td>
                      <td className="px-2 py-1 text-left">
                        <Link to={`/team/${encodeURIComponent(t.name)}`} className={`font-semibold ${t.name === team.name ? 'text-indigo-700' : 'text-gray-700'}`}>
                          {t.name}
                        </Link>
                      </td>
                      <td className="px-2 py-1 text-right font-bold">{t.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-6">
        <Link to="/" className="text-sm text-indigo-600">← Back to table</Link>
      </div>
    </div>
  )
}

export default TeamDetail
