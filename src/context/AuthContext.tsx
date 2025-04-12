import React, {useContext, useEffect, useState, createContext} from 'react'
import { IContextType, IUser } from '../types'
import { getCurrentUser } from '../lib/appwrite/api';
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {
    id:'',
    username:'',
    name:'',
    email:"",
    imageUrl:"",
    bio:'',
    accountId:''
}

const INITIAL_STATE = {
    user:INITIAL_USER,
    isLoading:false,
    isAuthenticated:false,
    setUser:()=>{},
    setIsAuthenticated:()=>{},
    checkAuthUser : async ()=>false as boolean,/**as i am returning a  promise  we use async*/
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({children}:{children :React.ReactNode})=> {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated]=useState(false);
    const navigate = useNavigate();
    const checkAuthUser = async()=>{
        try{
            const currentUserAccount = await getCurrentUser();
            if(currentUserAccount){
                setUser({
                    id: currentUserAccount.$id,/**more rebust way as catch block is not returning any value */
                    name: currentUserAccount.name,
                    username: currentUserAccount.username,
                    email: currentUserAccount.email,
                    imageUrl:currentUserAccount.imageUrl,
                    bio: currentUserAccount.bio,
                });
                setIsAuthenticated(true);
                return true;
            }
            return false;

        }catch(err){
            console.log(err);
            return false;
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        // || localStorage.getItem('cookieFallback')===null
        if(localStorage.getItem('cookieFallback')==='[]' || localStorage.getItem('cookieFallback')===null) {
            navigate('/sign-in')
        }
        
        checkAuthUser();
    }, [])

  return (
    <AuthContext.Provider value={{user, setUser, isLoading, isAuthenticated, setIsAuthenticated, checkAuthUser}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useUserContext = ()=>{
    return useContext(AuthContext);
}

export default AuthProvider;
