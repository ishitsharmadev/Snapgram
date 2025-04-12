import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGetUserById } from '../../lib/react-query/queriesAndMutations';
import Loader from '../../components/shared/Loader';
import { useUserContext } from '../../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GridPostsList from '../../components/shared/GridPostsList';


function Profile() {
  const {id} = useParams();
  const navigate = useNavigate();
  const {data:user, isPending:isFetchingUser} = useGetUserById(id || '');
  const {user:currUser} = useUserContext(); 

  if(isFetchingUser) return <Loader/>

  //1. Like posts fetch from user-->user
  //2. current user all posts -->user
  
  console.log(user?.liked);
  
  return (
    <div className='py-8 pr-8 space-y-6 flex flex-col sm:px-8 w-full text-white custom-scrollbar'>
      <div className='flex w-full justify-between xl:justify-normal space-x-7 xl:space-x-0'>
      <div className='w-1/6 hidden sm:block'><img className='w-36 h-36 rounded-full' src={user?.imageUrl} alt="user-profile" /></div>
      <div className='w-full flex flex-col space-y-4'>
        <div className='w-full flex space-x-4'><h1 className='text-xl sm:text-4xl font-bold'>{user?.name}</h1>
        {currUser.id === user?.$id?(<span 
        onClick={()=>{
          navigate(`/update-profile/${id}`);
        }}
        className='bg-dark-4 sm:w-28 w-24 flex justify-center px-2 items-center text-xs sm:text-base rounded-lg cursor-pointer h-7 sm:h-12'>
          <Link to={`/update-profile/${user?.$id}`} className='w-1/4'>
                <img src="/assets/icons/edit.svg" alt="edit-post" width={12} height={12} />
          </Link>
          <p className='w-full sm:text-sm text-xs'>Edit Profile</p></span>): ""}
        </div>
        <h4 className='text-slate-700 sm:text-base text-sm'>@{user?.username}</h4>
        <p className='w-full text-justify sm:text-base text-sm'>{user?.bio?user?.bio: "No bio yet"}</p>
      </div>
      </div>
      <div className='w-full px-8 sm:px-0 overflow-scroll custom-scrollbar'>
  <Tabs defaultValue="userPosts" className="w-full">
  <TabsList className='space-x-9'>
    <TabsTrigger value="userPosts">User Posts</TabsTrigger>
    <TabsTrigger value="likedPosts">Liked Posts</TabsTrigger>
  </TabsList>
  <div className='w-full py-6'>
  <TabsContent value="userPosts">{(user?.post.length>0)?<GridPostsList posts={user?.post} showUser={false} />:<p className='text-light-4 mt-10 text-center w-full'>No posts by the user yet</p>}</TabsContent>
  <TabsContent value="likedPosts">{(user?.liked?.length>0)?<GridPostsList posts={user?.liked} showUser={true} showStats={false} />:<p className='text-light-4 mt-10 text-center w-full'>Not a single post is liked by this user</p>}</TabsContent>
  </div>
</Tabs>
      </div>
    </div>
  )
}

export default Profile
