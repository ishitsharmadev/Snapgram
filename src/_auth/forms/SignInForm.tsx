import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignInValidation } from "../../lib/validation"
import Loader from "../../components/shared/Loader";
import {Link, useNavigate} from "react-router-dom"
import { toast } from "sonner";
import { useSignInAccountMutation } from "../../lib/react-query/queriesAndMutations";
import { useUserContext } from "../../context/AuthContext";



function SignInForm() {
    const {mutateAsync:signInAccount, isPending:isSigningIn} = useSignInAccountMutation();
    const {checkAuthUser, isLoading:isUserLoading, setIsAuthenticated} = useUserContext();
    const navigate = useNavigate();
    // 1. Define your form.
    const form = useForm<z.infer<typeof SignInValidation>>({
        resolver: zodResolver(SignInValidation),
        defaultValues: {
            email:'',
            password:"",
    },
  })
 
  // 2. Define a submit handler.
   async function onSubmit(values: z.infer<typeof SignInValidation>) {
        
        const session = await signInAccount({
          email:values.email,
          password:values.password
        });
        if(!session){
          return toast("SignIn failied. Please try again");
        }
       const isLoggedIn = await checkAuthUser();
       if(isLoggedIn){
        form.reset();
        setIsAuthenticated(true);
        navigate('/');
       }else{
        toast('SignIn failed. Please try again');
       }

  }

  return (
    
     <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
            <img src="/assets/images/logo.svg" alt="logo" />
            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
            <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back! Please enter your details</p>


        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-5 mt-4">
            
        <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' className="shad-input" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary">
            {isSigningIn?(<div className="flex-center gap-2 py-3">
                <Loader/> Loading...
            </div>):
            "Sign In"
            }
        </Button>
        <p className="text-small-regular text-light-2 text-center mt-2 ">
            Don't have an account? 
            <Link to='/sign-up' className="text-primary-500 text-small-semibold ml-1">Sign up</Link>
        </p>
      </form>
      </div>
    </Form>
  )
}

export default SignInForm
