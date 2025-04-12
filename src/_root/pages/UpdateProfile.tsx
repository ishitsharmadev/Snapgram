import { useParams } from "react-router-dom"
import { useGetUserById} from '../../lib/react-query/queriesAndMutations'
import Loader from '../../components/shared/Loader'
import UpdateProfileForm from '../../components/forms/UpdateProfileForm'

function UpdateProfile() {
  const {id} = useParams();
  const {data:user, isPending} = useGetUserById(id || '');
  
        if(isPending) return <Loader/>;
        

  return(
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
            <img src="/assets/icons/add-post.svg" alt="create-post" width={36} height={36}/>
            <h2 className='h3-bold md:h2-bold text-left w-full'>Edit Profile</h2>
        </div>
        <UpdateProfileForm user={user} />
      </div>
    </div>
    )
}

export default UpdateProfile
