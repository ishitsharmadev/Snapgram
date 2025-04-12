import {createRoot} from "react-dom/client";
import App from "./App";
import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom";
import SignInForm from "./_auth/forms/SignInForm";
import SignUpForm from "./_auth/forms/SignUpForm";
import AuthLayout from "./_auth/AuthLayout";
import { CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile, AllUsers } from "./_root/pages";
import RootLayout from "./_root/RootLayout";
import AuthProvider from "./context/AuthContext";
import QueryProvider from "./lib/react-query/QueryProvider";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AuthProvider><App/></AuthProvider>}>
            {/**public routes */}
            <Route element={<AuthLayout/>}>
                <Route path="/sign-in" element={<SignInForm/>}/>
                <Route path="/sign-up" element={<SignUpForm/>}/>
            </Route>

            {/* private Routes*/}
            <Route element={<RootLayout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/explore" element={<Explore/>}/>
                <Route path="/saved" element={<Saved/>}/>
                <Route path="/all-users" element={<AllUsers/>}/>
                <Route path="/create-post" element={<CreatePost/>}/>
                <Route path="/update-post/:id" element={<EditPost/>}/>
                <Route path="/posts/:id" element={<PostDetails/>}/>
                <Route path="/profile/:id/*" element={<Profile/>}/>
                <Route path="/update-profile/:id" element={<UpdateProfile/>}/>
            </Route>
        </Route>
    )
) 

createRoot(document.getElementById('root')!).render(//Typescript always need a value[innthis case we use ! because it is returning null as whole]
   <QueryProvider>
            <RouterProvider router={router}/>
   </QueryProvider>
   
)