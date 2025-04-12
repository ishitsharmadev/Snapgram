import { Models } from 'appwrite'
import React, { useEffect, useState } from 'react'
import { useDeleteSavePosts, useGetCurrentUser, useLikePosts, useSavePosts } from '../../lib/react-query/queriesAndMutations';
import { checkIsLiked } from '../../lib/utils';
import Loader from './Loader';

type PostStatsProps = {
    post?:Models.Document;
    userId:string
}

function PostStats({post, userId}:PostStatsProps) {
    const {mutateAsync:likePost} = useLikePosts();
    const {mutateAsync:savePost, isPending:isSavingPost} = useSavePosts();
    const {mutateAsync:deleteSavedPost, isPending:isDeletingSavedPost} = useDeleteSavePosts();
    const {data:currentUser} = useGetCurrentUser();
    const likesList = post?.likes.map((user:Models.Document)=>user.$id);

    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false);

    const savedPost = currentUser?.save.find((record:Models.Document)=>record.post.$id === post?.$id);
    useEffect(()=>{
      setIsSaved(!!savedPost);
    }, [currentUser])

    const handleLikePost = async(e:React.MouseEvent)=>{
        e.stopPropagation();// Not go to post array as it stops the propogation from lower  to higher component
        let newLikes = [...likes];
        const hasLiked = newLikes.includes(userId);
        if(hasLiked){
            newLikes = newLikes.filter((id)=>id!==userId);
        }else{
            newLikes.push(userId);
        }
        setLikes(newLikes);
        await likePost({postId:post?.$id || '', likesArray:newLikes});
    }

    const handleSavedPost = async(e:React.MouseEvent)=>{
        e.stopPropagation();
        
        if(savedPost){
            setIsSaved(false);
            await deleteSavedPost(savedPost.$id);
        }else{
          setIsSaved(true);
          await savePost({postId:post?.$id || '', userId:userId});
        }
    }

  return (
    <div className='flex justify-between z-20 items-center'>
      <div className='flex gap-2 mr-5'>
        <img src={checkIsLiked(likes, userId)?'/assets/icons/liked.svg':'/assets/icons/like.svg'} alt="like" width={20} height={20} onClick={handleLikePost} className='cursor-pointer'/>
        <p className='small-medium lg:base-medium'>{likes.length}</p>
      </div>

      <div className='flex gap-2'>
        {isDeletingSavedPost || isSavingPost?<Loader/>:(
          <img src={isSaved?'/assets/icons/saved.svg':'/assets/icons/save.svg'} alt="save" width={20} height={20} onClick={handleSavedPost} className='cursor-pointer'/>
        )}
      </div>
    </div>
  )
}

export default PostStats
