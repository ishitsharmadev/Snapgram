import { useGetCurrentUser } from '../../lib/react-query/queriesAndMutations'
import Loader from '../../components/shared/Loader'
import { Models } from 'appwrite'
import GridPosts from '../../components/shared/GridPosts'

function Saved() {
  const {data:user, isPending:isUsersLoading} = useGetCurrentUser()

  if(isUsersLoading) return <Loader/>
  
  if(!user?.save) return <Loader/>

  let posts = user.save.map((saved:Models.Document)=>saved.post);
  posts = posts.filter((post:Models.Document)=>post!=null);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className="w-full">
        <h2 className='h3-bold md:h2-bold text-left mb-6'>
          Saved Posts
        </h2>

        {posts.length === 0 ? (
          <p className='text-light-4 text-center w-full mt-10'>
            No saved posts
          </p>
        ) : (
          <GridPosts 
            posts={posts} 
            className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
          />
        )}
      </div>
    </div>
  )
}

export default Saved