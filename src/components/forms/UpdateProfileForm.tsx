import ProfileImgUploader from '../../components/shared/ProfileImgUploader'
import { Textarea } from '../../components/ui/textarea'
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Models } from 'appwrite'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateUser } from '../../lib/react-query/queriesAndMutations'
import { editProfileValidation } from '../../lib/validation'
import { toast } from 'sonner'

function UpdateProfileForm({user}:{user?:Models.Document}) {
    const {mutateAsync:updateUser, isPending:isUpdatingUser} = useUpdateUser();
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof editProfileValidation>>({
        resolver: zodResolver(editProfileValidation),
        defaultValues: {
          name:user?.name||'',
          bio:user?.bio || '',
          file:[]
        },
      })
    async function onSubmit(values: z.infer<typeof editProfileValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const updatedUser = await updateUser({
          ...values,
          userId:user?.$id || '',
          imageUrl:user?.imageUrl,
          imageId:user?.imageId
        })
        if(!updatedUser) toast('Please try again');
        navigate(`/profile/${user?.$id}`);
      }
  return (
    <div className='w-full'>
         <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label"></FormLabel>
                <FormControl>
                  <ProfileImgUploader feildChange={field.onChange} imageUrl={user?.imageUrl}/>
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder='I am Jhon' className="shad-textarea custom-scrollbar" {...field}/>
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <Button 
          disabled={isUpdatingUser}
          className="shad-button_primary whitespace-nowrap"
          type="submit"
          >Submit</Button>
        </form>
      </Form>
      </div>
  )
}

export default UpdateProfileForm
