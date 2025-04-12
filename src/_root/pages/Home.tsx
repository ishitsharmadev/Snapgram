import React from 'react'
import Loader from '../../components/shared/Loader';
import { useGetRecentPosts, useGetTopUsers } from '../../lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import PostCard from '../../components/shared/PostCard';
import PeopleCard from '../../components/shared/PeopleCard';
import { useUserContext } from '../../context/AuthContext';

function Home() {
  const { data: posts, isPending: isPostLoading } = useGetRecentPosts();
  const { data: users, isPending: isUsersLoading } = useGetTopUsers();
  const { user: currUser } = useUserContext();

  const isLoading = isPostLoading || isUsersLoading;
  const hasNoPosts = !posts?.documents.length;

  return (
    <div className='container mx-auto px-4 py-8 flex-1 overflow-scroll custom-scrollbar'>
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='flex-1'>
          <h2 className='h3-bold md:h2-bold text-left mb-6'>
            Home Feed
          </h2>

          {isLoading ? (
            <Loader />
          ) : hasNoPosts ? (
            <p className='text-center text-gray-500'>No posts to display</p>
          ) : (
            <ul className='space-y-6'>
              {posts?.documents.map((post: Models.Document) => (
                <PostCard 
                  key={post.$id} 
                  post={post}
                />
              ))}
            </ul>
          )}
        </div>

        <div className='hidden xl:grid grid-cols-1 2xl:grid-cols-2 gap-3 absolute top-5 right-8 2xl:right-0 w-[12rem] 2xl:w-[29rem]'>
          <PeopleCard 
            users={users?.documents} 
            userId={currUser?.id}
          />
        </div>
      </div>
    </div>
  )
}

export default Home