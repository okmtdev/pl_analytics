import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'

import news, { type NewsItem } from '../data/news'

const PAGE_SIZE = 6 // show 6 items per page (fits 2 rows of 3 on md)

export default function NewsList(){
    const { t } = useTranslation()
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    const visibleItems: NewsItem[] = useMemo(() => news.slice(0, visibleCount), [visibleCount])

    const showMore = () => setVisibleCount(c => Math.min(news.length, c + PAGE_SIZE))

  return (
    <div className="p-4 overflow-x-auto bg-white/90 rounded-xl shadow-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/60 bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
        <h2 className="text-2xl font-bold">{t('news')}</h2>
        <h3>ピックアックした最新ニュースをお送りします。</h3>
        <p className="text-sm text-indigo-100/80">{t('rank_table_details')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        {visibleItems.map(item => (
          <Link to={`/news/${item.id}`} key={item.id} className="block bg-white rounded-lg shadow hover:shadow-md overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.excerpt}</p>
              <p className="text-xs text-gray-400 mt-2">{item.date}</p>
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < news.length && (
        <div className="flex justify-center">
          <button onClick={showMore} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Show More</button>
        </div>
      )}
    </div>
  )
}
