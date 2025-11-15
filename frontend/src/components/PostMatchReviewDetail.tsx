import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

type Event = {
  minute: number
  team: 'home' | 'away'
  player: string
  type: 'goal' | 'yellow' | 'red' | 'sub'
  detail?: string // e.g. "on: Player B"
}

type PlayerStat = {
  name: string
  position?: string
  goals?: number
  yellow?: number
  red?: number
  subOn?: number | null // minute when came on
  subOff?: number | null // minute when substituted off
}

type TeamMatchData = {
  name: string
  score: number
  possession: number
  shots: number
  shotsOnTarget: number
  corners: number
  attacks: number
  xg: number
  starters: PlayerStat[]
  subs: PlayerStat[]
}

type MatchDetail = {
  id: string
  date: string
  competition: string
  stadium: string
  weather: { rain: string; temp: string; wind: string }
  attendance: number
  home: TeamMatchData
  away: TeamMatchData
  events: Event[]
}

const MOCK_DETAIL: Record<string, MatchDetail> = {
  '1': {
    id: '1',
    date: '2025-11-01 19:30',
    competition: 'Premier League',
    stadium: 'Etihad Stadium',
    weather: { rain: 'Light rain', temp: '12°C', wind: '5 km/h' },
    attendance: 53210,
    home: {
      name: 'Manchester City',
      score: 3,
      possession: 62,
      shots: 18,
      shotsOnTarget: 8,
      corners: 7,
      attacks: 53,
      xg: 2.7,
      starters: [
        { name: 'Ederson', position: 'GK' },
        { name: 'Walker', position: 'RB' },
        { name: 'Stones', position: 'CB' },
        { name: 'Dias', position: 'CB' },
        { name: 'Gvardiol', position: 'LB' },
        { name: 'Rodri', position: 'CM', goals: 0, yellow: 1 },
        { name: 'De Bruyne', position: 'CM', goals: 1 },
        { name: 'Bernardo', position: 'RW', goals: 1 },
        { name: 'Foden', position: 'LW' },
        { name: 'Haaland', position: 'ST', goals: 1 },
        { name: 'Silva', position: 'CM' },
      ],
      subs: [
        { name: 'Grealish', position: 'MF', subOn: 72 },
        { name: 'Alvarez', position: 'FW', subOn: 75 },
      ],
    },
    away: {
      name: 'Arsenal',
      score: 1,
      possession: 38,
      shots: 9,
      shotsOnTarget: 3,
      corners: 2,
      attacks: 47,
      xg: 1.1,
      starters: [
        { name: 'Ramsdale', position: 'GK' },
        { name: 'White', position: 'RB' },
        { name: 'Saliba', position: 'CB' },
        { name: 'Gabriel', position: 'CB' },
        { name: 'Oleksandr', position: 'LB' },
        { name: 'Rice', position: 'CM' },
        { name: 'Xhaka', position: 'CM' },
        { name: 'Saka', position: 'RW', goals: 1 },
        { name: 'Martinelli', position: 'LW' },
        { name: 'Ødegaard', position: 'AM' },
        { name: 'Jesus', position: 'ST' },
      ],
      subs: [
        { name: 'Nketiah', position: 'FW', subOn: 80 },
      ],
    },
    events: [
      { minute: 12, team: 'home', player: 'De Bruyne', type: 'goal' },
      { minute: 28, team: 'away', player: 'Saka', type: 'goal' },
      { minute: 45, team: 'home', player: 'Rodri', type: 'yellow' },
      { minute: 61, team: 'home', player: 'Haaland', type: 'goal' },
      { minute: 72, team: 'home', player: 'Grealish', type: 'sub', detail: 'on: Grealish, off: Silva' },
      { minute: 75, team: 'home', player: 'Alvarez', type: 'sub', detail: 'on: Alvarez, off: Foden' },
      { minute: 83, team: 'away', player: 'Nketiah', type: 'sub', detail: 'on: Nketiah, off: Jesus' },
    ],
  },
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 rounded">{children}</span>
}

function EventIcon({ type }: { type: Event['type'] }) {
  if (type === 'goal') return <span className="text-green-600">⚽</span>
  if (type === 'yellow') return <span className="text-yellow-600">🟨</span>
  if (type === 'red') return <span className="text-red-600">🟥</span>
  return <span className="text-gray-600">🔁</span>
}

const PostMatchReviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const detail = (id && MOCK_DETAIL[id]) ? MOCK_DETAIL[id] : MOCK_DETAIL['1']

  const resultText = detail.home.score > detail.away.score ? 'Home Win' : detail.home.score < detail.away.score ? 'Away Win' : 'Draw'

  return (
    <div className="p-6 overflow-x-auto bg-white/90 rounded-xl shadow-2xl overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm text-gray-500">{detail.competition} — {detail.date}</div>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-center">
              <div className="text-xl font-bold">{detail.home.name}</div>
              <div className="text-4xl font-extrabold text-indigo-700">{detail.home.score}</div>
            </div>
            <div className="text-2xl font-bold">-</div>
            <div className="text-center">
              <div className="text-xl font-bold">{detail.away.name}</div>
              <div className="text-4xl font-extrabold text-gray-700">{detail.away.score}</div>
            </div>
            <div className="ml-6">
              <Badge>{resultText}</Badge>
            </div>
          </div>
        </div>

        <div className="text-right">
          <button onClick={() => navigate(-1)} className="px-3 py-1 rounded bg-gray-100">Back</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team stats */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded p-4 border">
          <h3 className="font-semibold mb-3">Match Statistics</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500">
                <th className="text-left w-1/3">Stat</th>
                <th className="text-center">{detail.home.name}</th>
                <th className="text-center">{detail.away.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-2">Possession</td>
                <td className="text-center">{detail.home.possession}%</td>
                <td className="text-center">{detail.away.possession}%</td>
              </tr>
              <tr className="border-t">
                <td className="py-2">Shots (On target)</td>
                <td className="text-center">{detail.home.shots} ({detail.home.shotsOnTarget})</td>
                <td className="text-center">{detail.away.shots} ({detail.away.shotsOnTarget})</td>
              </tr>
              <tr className="border-t">
                <td className="py-2">Corners</td>
                <td className="text-center">{detail.home.corners}</td>
                <td className="text-center">{detail.away.corners}</td>
              </tr>
              <tr className="border-t">
                <td className="py-2">Attacks</td>
                <td className="text-center">{detail.home.attacks}</td>
                <td className="text-center">{detail.away.attacks}</td>
              </tr>
              <tr className="border-t">
                <td className="py-2">Expected Goals (xG)</td>
                <td className="text-center">{detail.home.xg.toFixed(2)}</td>
                <td className="text-center">{detail.away.xg.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Timeline</h4>
            <div className="border rounded p-3 max-h-56 overflow-auto">
              {detail.events.sort((a, b) => a.minute - b.minute).map((ev, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b last:border-b-0">
                  <div className="w-10 text-xs text-gray-500">{ev.minute}'</div>
                  <div className="w-6">{<EventIcon type={ev.type} />}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{ev.player} <span className="text-xs text-gray-500">({ev.team === 'home' ? detail.home.name : detail.away.name})</span></div>
                    {ev.detail && <div className="text-xs text-gray-500">{ev.detail}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Match environment and lineups */}
        <div className="col-span-1 bg-white rounded p-4 border">
          <h3 className="font-semibold mb-2">Match Info</h3>
          <div className="text-sm text-gray-600 mb-3">
            <div><strong>Stadium:</strong> {detail.stadium}</div>
            <div><strong>Weather:</strong> {detail.weather.rain} / {detail.weather.temp} / {detail.weather.wind}</div>
            <div><strong>Attendance:</strong> {detail.attendance.toLocaleString()}</div>
          </div>

          <div className="mb-3">
            <h4 className="font-semibold">{detail.home.name} - Starters</h4>
            <ul className="text-sm mt-2">
              {detail.home.starters.map((p, i) => (
                <li key={i} className="flex items-center justify-between py-1 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{p.name} <span className="text-xs text-gray-500">{p.position}</span></div>
                    <div className="text-xs text-gray-500">Goals: {p.goals || 0} · YC: {p.yellow || 0} · RC: {p.red || 0}</div>
                  </div>
                  <div className="text-xs text-gray-500">{p.subOff ? `${p.subOff}'` : ''}</div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">{detail.home.name} - Substitutes</h4>
            <ul className="text-sm mt-2">
              {detail.home.subs.map((p, i) => (
                <li key={i} className="flex items-center justify-between py-1 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{p.name} <span className="text-xs text-gray-500">{p.position}</span></div>
                    <div className="text-xs text-gray-500">Goals: {p.goals || 0} · YC: {p.yellow || 0}</div>
                  </div>
                  <div className="text-xs text-gray-500">{p.subOn ? `${p.subOn}'` : ''}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold">{detail.away.name} - Starters</h4>
            <ul className="text-sm mt-2">
              {detail.away.starters.map((p, i) => (
                <li key={i} className="flex items-center justify-between py-1 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{p.name} <span className="text-xs text-gray-500">{p.position}</span></div>
                    <div className="text-xs text-gray-500">Goals: {p.goals || 0} · YC: {p.yellow || 0} · RC: {p.red || 0}</div>
                  </div>
                  <div className="text-xs text-gray-500">{p.subOff ? `${p.subOff}'` : ''}</div>
                </li>
              ))}
            </ul>

            <h4 className="font-semibold mt-3">{detail.away.name} - Substitutes</h4>
            <ul className="text-sm mt-2">
              {detail.away.subs.map((p, i) => (
                <li key={i} className="flex items-center justify-between py-1 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{p.name} <span className="text-xs text-gray-500">{p.position}</span></div>
                    <div className="text-xs text-gray-500">Goals: {p.goals || 0} · YC: {p.yellow || 0}</div>
                  </div>
                  <div className="text-xs text-gray-500">{p.subOn ? `${p.subOn}'` : ''}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}

export default PostMatchReviewDetail
