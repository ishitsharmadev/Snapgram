import { useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccountMutation } from '../../lib/react-query/queriesAndMutations'
import { useUserContext } from '../../context/AuthContext';

function Topbar() {
    const  {mutateAsync:signOut, isSuccess} = useSignOutAccountMutation();
    const navigate = useNavigate();
    const {user, setIsAuthenticated} = useUserContext();
    useEffect(()=>{
        if(isSuccess){
            navigate(0);// Navate to signup or signIn screen
        }
    }, [isSuccess])

  return (
    <div className='topbar'>
      <div className='flex-between py-4 px-5'>
        <Link to='/' className='flex gap-3 items-center'>
            <img src="/assets/images/logo.svg" alt="logo" width={130} height={325} />
        </Link>
        <div className='flex gap-4'>
            <Button 
            variant='ghost' 
            className='shad-button_ghost'
            onClick={()=>{
              setIsAuthenticated(false);
              signOut()
            }}
            >
                <img src="/assets/icons/logout.svg" alt="logout" />
            </Button>
            <Link className='flex flex-center gap-3' to={`/profile/${user.id}`}>
                <img 
                src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                alt="profile" 
                className='h-8 w-8 rounded-full'
                />
            </Link>
        </div>
      </div>
    </div>
  )
}

export default Topbar
