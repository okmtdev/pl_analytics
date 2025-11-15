import React, { useState, useEffect } from 'react'
import { teams } from '../data/teams'
import { Link } from 'react-router-dom'


const ChevronUp: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronDown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const STORAGE_KEY = 'teamLogoBarOpen'

const TeamLogoBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw === null ? true : raw === 'true'
    } catch (e) {
      return true
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, isOpen ? 'true' : 'false')
    } catch (e) {
      // ignore
    }
  }, [isOpen])

  return (
    <div className="px-1 py-1 text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full mb-3 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
        >
          <h3 className="text-lg font-semibold">Teams</h3>
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        
        {isOpen && (
          <div className="flex flex-wrap gap-3 items-center animate-fadeIn">
            {teams.map(team => (
              <Link 
                key={team.pos} 
                to={`/team/${encodeURIComponent(team.name)}`} 
                className="w-16 h-16 flex items-center justify-center rounded-md hover:bg-white/20 transition"
              >
                <img src={team.logo} alt={team.name} className="max-h-11" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamLogoBar
