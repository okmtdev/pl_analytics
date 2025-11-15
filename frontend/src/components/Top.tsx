import RankingTable from './RankingTable'
import NewsList from './NewsList'
import PostMatchReviewList from './PostMatchReviewList'



const Top: React.FC = () => {
  return (
    <div className="space-y-6">
      <NewsList />
      <PostMatchReviewList />
      <RankingTable />
    </div>
  )
}

export default Top
