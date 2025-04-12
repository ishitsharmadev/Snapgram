import {
    useQuery/**For fetching the data */,
     useMutation/**Modifying and saving the data */, 
     useInfiniteQuery, 
     useQueryClient
} from "@tanstack/react-query";/**useed for infinite scrolling and  chaching the data. */
import { createPost, createUserAccount, deletePost, deleteSavePost, getCurrentUser, getInfinitePosts, getInfiniteUsers, getPostById, getRecentPosts, getSavedPosts, getUserById, getUsers, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost, updateUser } from "../appwrite/api";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "../../types";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccountMutation=()=>{// Level in between frontend and appwrite for easy time in Feching, queryinng and chaching the data
    return useMutation({
        mutationFn:(user:INewUser)=>createUserAccount(user),

    });
}

export const useSignInAccountMutation = ()=>{
    return  useMutation({
        mutationFn:(user:{email:string, password:string})=>signInAccount(user),
    })
}

export const useSignOutAccountMutation = ()=>{
    return useMutation({
        mutationFn:()=>signOutAccount(),
    })
}

export const useCreatePostMutation = ()=>{
    // Query all the existing post also after creating a post
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(post:INewPost)=>createPost(post),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]/**It allows us to request new fresh data*/
            })
        }
    })
}

export const useGetRecentPosts = ()=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
        queryFn:()=>getRecentPosts(),
    })
}

export const useLikePosts = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({postId, likesArray}:{postId:string, likesArray:string[]})=>likePost(postId, likesArray),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_USER_BY_ID]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_USER_BY_ID]
            })
        }
    })

}

export const useSavePosts = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({postId, userId}:{postId:string, userId:string})=>savePost(userId, postId),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })

}

export const useDeleteSavePosts = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(savedRecordId:string)=>deleteSavePost(savedRecordId),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })

}

export const useGetCurrentUser = ()=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER],
        queryFn:()=>getCurrentUser(),
    })
}

export const useGetPostById = (postId:string)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn:()=>getPostById(postId),
        enabled:!!postId/**no refetching if postId doesnot change. */
    })
}


export const useUpdatePost = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(post:IUpdatePost)=>updatePost(post),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POST_BY_ID, data.$id],
            })

        }
    })
}

export const useDeletePost = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({postId, imageId}: {postId:string, imageId:string})=>deletePost(postId, imageId),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
            })

        }
    })
}

export const useGetPosts = ()=>{
    return useInfiniteQuery({
        queryKey:[QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn:getInfinitePosts,
        getNextPageParam:(lastPage)=>{
            if(lastPage && lastPage?.documents.length===0){
                return null;
            }
            const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;
            return lastId;
        }
    })
}

export const useSearchPosts = (searchTerm:string)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn:()=>searchPosts(searchTerm),
        enabled:!!searchTerm
    })
}

export const useGetUsers = ()=>{
    return useInfiniteQuery({
        queryKey:[QUERY_KEYS.GET_USERS],
        queryFn:getInfiniteUsers,
        getNextPageParam:(lastPage)=>{
            if(lastPage && lastPage.documents.length===0) return null;
            const lastId = lastPage?.documents[lastPage.documents.length - 1].$id; 
            return lastId;
        }
    })
}

export const useGetTopUsers = ()=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_USERS_LIMITED],
        queryFn:getUsers
    })
}

export const useGetSavedPosts = ()=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_SAVED_POSTS],
        queryFn:()=>getSavedPosts()
    })
}

export const useGetUserById = (userId:string)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn:()=>getUserById(userId)
    })
}

export const useUpdateUser = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(user:IUpdateUser)=>updateUser(user),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_USER_BY_ID]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_USERS]
            })
        }
    })
}