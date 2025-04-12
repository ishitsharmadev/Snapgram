import { Models } from 'appwrite'
import React from 'react'
import { useUserContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom';
import PostStats from './PostStats';

type GridPostListProps =  {
    posts?:Models.Document[],
    showUser?:boolean,
    showStats?:boolean
}

function GridPostsList({posts, showUser=true, showStats=true}:GridPostListProps) {
    const  {user} = useUserContext();
    
  return (
    <div className=''>
      <ul className='grid-container'>
        {posts.map((post:Models.Document, i:number)=>(
            <li key={i} className='relative min-w-80 h-80'>
            <Link to={`/posts/${post.$id}`} className='grid-post_link'>
              <img src={post.imageUrl} 
               className='h-full w-full object-cover'
              alt="post" 
              />
            </Link>
            <div className='grid-post_user'>
              {showUser && (
                <div className='flex items-center gap-2 flex-1 justify-start'>
                    <img src={post.creator.imageUrl} alt="user" className='h-8 w-8 rounded-full' />
                    <p className='line-clamp-1'>{post.creator.name}</p>
                </div>
              )}
              {showStats && (
                <PostStats post={post} userId={user.id}/>
              )}
            </div>
            </li>
        ))}
      </ul>
    </div>
  )
}

export default GridPostsList
