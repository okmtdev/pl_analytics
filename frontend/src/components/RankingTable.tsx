import React from 'react'
import { useTranslation } from 'react-i18next'
import FormDots from '../utils/FormDots'

import reactLogo from '../assets/react.svg'
import arsenalLogo from '../assets/Arsenal.svg'
import manchesterCityLogo from '../assets/Manchester City.svg'

type Team = {
  pos: number
  name: string
  played: number
  won: number
  draw: number
  lost: number
  gf: number
  ga: number
  gd: number
  pts: number
  form: ('W' | 'D' | 'L')[]
  logo?: string
}

const teams: Team[] = [
  { pos: 1, name: 'Manchester City', played: 38, won: 29, draw: 6, lost: 3, gf: 89, ga: 25, gd: 64, pts: 93, form: ['W','W','W','D','W'], logo: manchesterCityLogo },
  { pos: 2, name: 'Arsenal', played: 38, won: 26, draw: 8, lost: 4, gf: 88, ga: 36, gd: 52, pts: 86, form: ['W','D','W','W','W'], logo: arsenalLogo },
  { pos: 3, name: 'Liverpool', played: 38, won: 23, draw: 9, lost: 6, gf: 75, ga: 34, gd: 41, pts: 78, form: ['W','L','W','W','D'], logo: reactLogo },
  { pos: 4, name: 'Chelsea', played: 38, won: 20, draw: 8, lost: 10, gf: 63, ga: 44, gd: 19, pts: 68, form: ['D','W','L','W','W'], logo: reactLogo },
  { pos: 5, name: 'Manchester United', played: 38, won: 18, draw: 9, lost: 11, gf: 58, ga: 49, gd: 9, pts: 63, form: ['W','W','D','L','W'], logo: reactLogo },
  { pos: 6, name: 'Tottenham', played: 38, won: 17, draw: 10, lost: 11, gf: 61, ga: 50, gd: 11, pts: 61, form: ['L','W','W','D','W'], logo: reactLogo },
  { pos: 7, name: 'Newcastle United', played: 38, won: 16, draw: 11, lost: 11, gf: 55, ga: 45, gd: 10, pts: 59, form: ['W','D','W','L','W'], logo: reactLogo },
  { pos: 8, name: 'Aston Villa', played: 38, won: 15, draw: 11, lost: 12, gf: 52, ga: 48, gd: 4, pts: 56, form: ['L','W','D','W','D'], logo: reactLogo },
  { pos: 9, name: 'Wolverhampton', played: 38, won: 14, draw: 9, lost: 15, gf: 49, ga: 52, gd: -3, pts: 51, form: ['D','L','W','L','D'], logo: reactLogo },
  { pos: 10, name: 'Brighton', played: 38, won: 13, draw: 10, lost: 15, gf: 50, ga: 54, gd: -4, pts: 49, form: ['W','D','L','W','L'], logo: reactLogo },
  { pos: 11, name: 'Brentford', played: 38, won: 12, draw: 11, lost: 15, gf: 48, ga: 56, gd: -8, pts: 47, form: ['L','D','W','L','W'], logo: reactLogo },
  { pos: 12, name: 'Crystal Palace', played: 38, won: 12, draw: 9, lost: 17, gf: 45, ga: 59, gd: -14, pts: 45, form: ['L','L','W','D','L'], logo: reactLogo },
  { pos: 13, name: 'Everton', played: 38, won: 11, draw: 10, lost: 17, gf: 44, ga: 60, gd: -16, pts: 43, form: ['D','L','L','W','D'], logo: reactLogo },
  { pos: 14, name: 'Leicester City', played: 38, won: 10, draw: 11, lost: 17, gf: 42, ga: 61, gd: -19, pts: 41, form: ['W','L','D','L','L'], logo: reactLogo },
  { pos: 15, name: 'Nottingham Forest', played: 38, won: 9, draw: 12, lost: 17, gf: 38, ga: 62, gd: -24, pts: 39, form: ['L','D','L','D','L'], logo: reactLogo },
  { pos: 16, name: 'Southampton', played: 38, won: 8, draw: 13, lost: 17, gf: 36, ga: 64, gd: -28, pts: 37, form: ['D','L','D','L','L'], logo: reactLogo },
  { pos: 17, name: 'West Ham United', played: 38, won: 8, draw: 10, lost: 20, gf: 34, ga: 66, gd: -32, pts: 34, form: ['L','L','W','L','D'], logo: reactLogo },
  { pos: 18, name: 'Bournemouth', played: 38, won: 7, draw: 9, lost: 22, gf: 33, ga: 70, gd: -37, pts: 30, form: ['L','L','L','D','L'], logo: reactLogo },
  { pos: 19, name: 'Sheffield United', played: 38, won: 6, draw: 10, lost: 22, gf: 29, ga: 75, gd: -46, pts: 28, form: ['L','L','L','L','D'], logo: reactLogo },
  { pos: 20, name: 'Burnley', played: 38, won: 5, draw: 9, lost: 24, gf: 24, ga: 78, gd: -54, pts: 24, form: ['L','L','L','L','L'], logo: reactLogo },
]

function getZone(pos: number) {
  if (pos >= 1 && pos <= 4) return { key: 'cl', className: 'bg-indigo-50' }
  if (pos === 5 || pos === 6) return { key: 'el', className: 'bg-yellow-50' }
  if (pos >= 18 && pos <= 20) return { key: 'relegated', className: 'bg-red-50' }
  return { key: '', className: '' }
}

const RankingTable: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="p-4 overflow-x-auto bg-white/90 rounded-xl shadow-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/60 bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
        <h2 className="text-2xl font-bold">{t('rank_table_title')}</h2>
        <h3>第n節</h3>
        <p className="text-sm text-indigo-100/80">{t('rank_table_details')}</p>
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-500 uppercase">
            <th className="px-4 py-2 w-10">#</th>
            <th className="px-2 py-2 text-left min-w-[140px] sm:min-w-[200px]">{t('team')}</th>
            <th className="px-2 py-2">{t('played')}</th>
            <th className="px-2 py-2">{t('won')}</th>
            <th className="px-2 py-2">{t('draw')}</th>
            <th className="px-2 py-2">{t('lost')}</th>
            <th className="px-2 py-2">{t('gf')}</th>
            <th className="px-2 py-2">{t('ga')}</th>
            <th className="px-2 py-2">{t('gd')}</th>
            <th className="px-2 py-2 text-left">{t('form')}</th>
            <th className="px-2 py-2 w-24 text-right">{t('pts')}</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => {
            const zone = getZone(team.pos)
            return (
              <tr key={team.pos} className="border-b border-gray-100">
                <td className="px-3 py-3 align-middle">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${zone.key === 'cl' ? 'bg-indigo-100 text-indigo-700' : zone.key === 'el' ? 'bg-yellow-100 text-yellow-700' : zone.key === 'relegated' ? 'bg-red-100 text-red-700' : 'text-gray-700'}`}>
                    {team.pos}
                  </div>
                </td>
                <td className="px-3 py-3 text-left min-w-[140px] sm:min-w-[200px]">
                  <div className="font-semibold text-gray-800 break-words">{t(`teams.${team.name}`)}</div>
                  <div className="text-xs text-gray-500">{t(`stadiums.${team.name}`)}</div>
                </td>
                <td className="px-2 py-2 text-gray-700">{team.played}</td>
                <td className="px-2 py-2 text-green-600">{team.won}</td>
                <td className="px-2 py-2 text-yellow-600">{team.draw}</td>
                <td className="px-2 py-2 text-red-600">{team.lost}</td>
                <td className="px-2 py-2 text-gray-700">{team.gf}</td>
                <td className="px-2 py-2 text-gray-700">{team.ga}</td>
                <td className={`px-2 py-2 font-bold ${team.gd >= 0 ? 'text-green-600' : 'text-red-600'}`}>{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                <td className="px-2 py-2"><FormDots form={team.form} /></td>
                <td className="px-2 py-2 text-right font-bold text-gray-800">{team.pts}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="mt-4 text-xs text-gray-500">{t('note')}</div>

      <div className="mt-4 flex gap-3 text-xs items-center">
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-indigo-100 border border-indigo-200"></span><span className="text-gray-700">{t('cl')}</span></div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200"></span><span className="text-gray-700">{t('el')}</span></div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-red-100 border border-red-200"></span><span className="text-gray-700">{t('relegated')}</span></div>
      </div>
    </div>
  )
}

export default RankingTable
