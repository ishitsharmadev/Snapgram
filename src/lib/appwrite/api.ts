import { ID } from "appwrite";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "../../types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { Query } from "appwrite";

export async function createUserAccount(user:INewUser){
    try{
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if(!newAccount) throw Error;
        const avatarUrl = await avatars.getInitials(user.name);
        const avatarFormattedUrl = new URL(avatarUrl);
        const newUser = await saveUserToDB({
            accountId:newAccount.$id,
            name:newAccount.name,
            email:newAccount.email,
            username:user.username,
            imageUrl:avatarFormattedUrl,
        });

        return newUser;
    }catch(err){
        console.log(err);
        return err;
    }
}

export async function saveUserToDB(user:{
    accountId:string,
    email:string,
    name:string,
    imageUrl:URL,
    username?:string
}) {
    try{
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            user,
        )
        return newUser;
    }catch(err){
        console.log(err);

    }
}

export async function signInAccount(user:{email:string, password:string}) {
    try{
        
        const currentSession = await account.getSession('current');
        if(currentSession)await account.deleteSession(currentSession.$id);

        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;
    }catch(err){
        console.log(err);
    }    
}

export async function getCurrentUser(){
    try{
        const currentAccount = await account.get();
        if(!currentAccount)throw Error;
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );
        return currentUser.documents[0]; 
    }catch(err){
        console.log(err);
    }
}

export async function signOutAccount(){
    try{
        const session = await account.deleteSession('current');
        return session;
    }catch(err){
        console.log(err);
        throw err;
    }
}

export async function createPost(post:INewPost){
    try{
        // upload image to storage
        const uploadFile = await uploadFileToStorage(post.file[0]);
        if(!uploadFile) throw Error;
        // Get file url
        const fileUrl = await getFilePreview(uploadFile.$id);
        if(!fileUrl){
            deleteFile(uploadFile.$id);
            throw Error;
        }
        // Convert the tags into a array
        const tags = post?.tags?.replace(/ /g, '').split(",");/**The / /g is a regular expression that targets all spaces in the string
                                                                The g flag makes it global, meaning it replaces all occurrences, not just the first one */
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            ID.unique(),
            {
                creator:post.userId,
                caption:post.caption,
                imageUrl:fileUrl,
                imageId: uploadFile.$id,
                location:post.location,
                tags:tags,
            }
        )
        if(!newPost){
            deleteFile(uploadFile.$id);
            throw Error;
        }
        return newPost;

    }catch(err){
        console.log(err);
    }
}

export async function uploadFileToStorage(file:File){
    try{
        const uploadFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadFile;
    }catch(err){
        console.log(err);
        
    }
}

export async function getFilePreview(fileId:string){
    try{
        const fileUrl =  await storage.getFileView(
            appwriteConfig.storageId,
            fileId,
        );
        return fileUrl;
    }catch(err){
        console.log(err);
    }
}

export async function deleteFile(fileId:string) {
    try{
        await storage.deleteFile(
            appwriteConfig.storageId,
            fileId
        );
        return {status:"ok"};
    }catch(err){
        console.log(err);
        
    }
} 

export async function getRecentPosts() {
   try{
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    );
    if(!posts) throw Error;
    return posts;
   }catch(err){
    console.log(err);
   }
}

export async function likePost(postId:string, likesArray:string[]) {
    try{
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId,
            {
                likes:likesArray,
            }
        );
        if(!updatedPost) throw Error;
        return updatedPost;
    }catch(err){
        console.log(err);
        
    }
}

export async function savePost(userId:string, postId:string) {
    try{
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user:userId,
                post:postId
            }
        );
        if(!updatedPost) throw Error;
        return updatedPost;
    }catch(err){
        console.log(err);
        
    }
}

export async function deleteSavePost(savedRecordId:string) {
    try{
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId,
        );
        if(!statusCode) throw Error;
        return {status:"0k"};
    }catch(err){
        console.log(err);
        
    }
}

export async function getPostById(postId:string) {
    try{
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId
        )
        return post;
    }catch(err){
        console.log(err);
        
    }
}

export async function updatePost(post: IUpdatePost) {
    const hasFileUpdate = post?.file.length>0;
    try{
        const postImageUrl= new URL(post?.imageUrl);
        let image = {
            imageUrl:postImageUrl,
            imageId:post?.imageId
        }
        if(hasFileUpdate){
            await deleteFile(image.imageId);
            // upload image to storage
            const uploadFile = await uploadFileToStorage(post.file[0]);

            if(!uploadFile) throw Error;
            // Get file url
            const fileUrl = await getFilePreview(uploadFile.$id);
            if(!fileUrl){
                deleteFile(uploadFile.$id);
                throw Error;
            }
            image = {...image, imageUrl:new URL(fileUrl),  imageId:uploadFile.$id}
        }
        // Convert the tags into a array
        const tags = post?.tags?.replace(/ /g, '').split(",");/**The / /g is a regular expression that targets all spaces in the string
                                                                The g flag makes it global, meaning it replaces all occurrences, not just the first one */
        const updatePost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            post.postId,
            {
                caption:post.caption,
                imageUrl:image.imageUrl,
                imageId: image.imageId,
                location:post.location,
                tags:tags,
            }
        )
        if(!updatePost){
            deleteFile(image.imageId);
            throw Error;
        }
        return updatePost;

    }catch(err){
        console.log(err);
    }
}

export async function deletePost(postId:string, imageId:string) {
    if(!postId || !imageId) throw Error;
    try{
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId
        )
        await deleteFile(imageId);
        return {stats:"ok"}
    }catch(err){
        console.log(err);
        
    }
}

export async function getInfinitePosts({pageParam}:{pageParam:number}) {
    const quries:any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)];
    if(pageParam){
        quries.push(Query.cursorAfter(pageParam.toString()));//If we are at page 1 and want to skip "pageParams" pages we can use this to fetch next 10
    }
    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            quries
        );
        if(!posts)throw Error;
        return posts;
    }catch(err){
        console.log(err);
    }
}

export async function searchPosts(searchTerm:string) {
    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            [Query.search('caption', searchTerm)]
        );
        if(!posts)throw Error;
        return posts;
    }catch(err){
        console.log(err);
    }
}

export const getUsers = async ()=>{
    const quries = [Query.orderAsc('$createdAt'), Query.limit(10)];
    try{
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            quries
        );
        if(!users) throw Error;
        return users;
    }catch(err){
        console.log(err);
    }
}

export async function getInfiniteUsers({pageParam}: {pageParam:number}) {
    const query = [Query.limit(20)];
    if(pageParam){
        query.push(Query.cursorAfter(pageParam?.toString()));
    }
    try{
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            query
        );
        if(!users) throw Error;
        return users;
    }catch(err){
        console.log(err);
        throw err;
    }
}

export async function getSavedPosts() {
    try{
        const savedPosts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            [Query.orderAsc('$createdAt')]
        );
        if(!savedPosts){
            throw Error;
        }
        return savedPosts.documents;
    }catch(err){
        console.log(err);
    }
}

export async function getUserById (userId:string){
    try{
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            userId
        );
        if(!user) throw Error;
        return user;
    }catch(err){
        console.log(err);
    }
}

export async function updateUser(user:IUpdateUser) {
    const hasUpdatedImage = user.file.length > 0;
    try{
        let image = {
            imageUrl:user.imageUrl,
            imageId:user.imageId,
        } 
        if(hasUpdatedImage){
            if(user.imageId) await deleteFile(user.imageId);
            const uploadFile = await uploadFileToStorage(user.file[0]);
            if(!uploadFile)throw Error;
            const imageUrl = await getFilePreview(uploadFile.$id);
            
            if(!imageUrl){
                await deleteFile(uploadFile.$id);
                throw Error;
            }
            const newUrl = new URL(imageUrl);
            image = {
                imageUrl:newUrl,
                imageId:uploadFile.$id
            }
        }
            const updateUser = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                user.userId,
                {
                    name:user.name,
                    bio:user.bio,
                    imageId:image.imageId,
                    imageUrl:image.imageUrl,
                }
            );
            if(!updateUser)throw Error;
            return updateUser;
    }catch(err){
        console.log(err);
    }
}