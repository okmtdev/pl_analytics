import { useParams, Link } from 'react-router-dom'
import news from '../data/news'

export default function NewsDetail(){
  const { id } = useParams<{ id: string }>()
  const item = news.find(n => n.id === id)

  if(!item) return (
    <div className="p-6">
      <p>ニュースが見つかりません</p>
      <Link to="/">戻る</Link>
    </div>
  )

  return (
    <div className="p-6 bg-white/90 rounded-xl shadow-2xl overflow-hidden">
      <Link to="/" className="text-sm text-blue-600">&larr; 戻る</Link>
      <h1 className="text-2xl font-bold mt-2">{item.title}</h1>
      <p className="text-xs text-gray-400">{item.date}</p>
      <img src={item.image} alt={item.title} className="w-full max-h-80 object-cover my-4 rounded" />
      <p className="text-gray-700">{item.content}</p>
    </div>
  )
}
