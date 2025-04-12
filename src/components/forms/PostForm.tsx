import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form,FormControl, FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import FileUploader from '../shared/FileUploader'
import { postValidation } from '../../lib/validation'
import { Models } from 'appwrite'
import {useCreatePostMutation, useUpdatePost} from '../../lib/react-query/queriesAndMutations'
import { useUserContext } from '../../context/AuthContext'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'



function PostForm({post, action}: {
    post?:Models.Document;/**Just a schema of document by appwrite */
    action:string
}) {
    const navigate = useNavigate();
    const {mutateAsync:createPost, isPending:isLoadingCreate} = useCreatePostMutation();
    const {mutateAsync:updatePost, isPending:isLodingUpdate} = useUpdatePost();
    const {user} = useUserContext();
    const form = useForm<z.infer<typeof postValidation>>({
        resolver: zodResolver(postValidation),
        defaultValues: {
          caption:post?post?.caption: '',
          file: [],
          location:post?post?.location:"",
          tags:post?post?.tags.join(','):"",

        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof postValidation>) {
        if(post && action==='Update'){
          const updateAExistingPost = await updatePost({
            ...values,
            postId:post?.$id,
            imageId:post?.imageId,
            imageUrl:post?.imageUrl
          })
          if(!updateAExistingPost)toast("Please try again")
          return navigate(`/posts/${post.$id}`) 
        }
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
         const newPost = await createPost({
            ...values,
            userId:user.id,
         });
         if(!newPost) toast('Please try again');
         navigate('/');

      }

      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Caption</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your caption here!!" className="shad-textarea custom-scrollbar" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Add Photos</FormLabel>
                  <FormControl>
                    <FileUploader
                    feildChange={field.onChange}
                    mediaUrl={post?.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Add Location</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Add Tags (saperated by " , ")</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Art, Expression, Learn" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <div className='gap-4 flex items-center justify-end'>
            <Button type="button" className="shad-button_dark_4">Cancel</Button>
            <Button 
             type="submit" 
             className="shad-button_primary whitespace-nowrap"
             disabled={isLoadingCreate || isLodingUpdate}
             >
              {action}
              {isLoadingCreate || isLodingUpdate && <div>Loading...</div>}
            </Button>
            </div>
          </form>
        </Form>
      )
}

export default PostForm
