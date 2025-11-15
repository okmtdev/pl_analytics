import './App.css'
import './i18n'

import Header from './components/Header'
import RankingTable from './components/RankingTable'
import Footer from './components/Footer'

function App() {

  return (
    <div className="max-w-6xl mx-auto">
      <Header />
      <main className="bg-white/90 rounded-xl shadow-2xl overflow-hidden">
        <RankingTable />
      </main>
      <Footer />
    </div>
  )
}

export default App
