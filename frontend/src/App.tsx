import './App.css'
import './i18n'

import Header from './components/Header'
import Footer from './components/Footer'
import TeamLogoBar from './components/TeamLogoBar'
import TeamDetail from './components/TeamDetail'
import Top from './components/Top'
import NewsList from './components/NewsList'
import NewsDetail from './components/NewsDetail'
import PostMatchReviewList from './components/PostMatchReviewList'
import PostMatchReviewDetail from './components/PostMatchReviewDetail'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-6xl mx-auto">
        <Header />
        <div>
          <Routes>
            <Route path="/" element={<Top />} />
            <Route path="/team/:name" element={<TeamDetail />} />
            <Route path="/news" element={<NewsList />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/postmatch" element={<PostMatchReviewList />} />
            <Route path="/postmatch/:id" element={<PostMatchReviewDetail />} />
          </Routes>
        </div>
        <TeamLogoBar />
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
