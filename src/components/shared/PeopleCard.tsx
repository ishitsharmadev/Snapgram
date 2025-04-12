import { Models } from 'appwrite'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom';

type PeopleCardProps = {
    users?:Models.Document[];
    userId:string
    }
    

function PeopleCard({ users, userId }:PeopleCardProps) {
    const navigate = useNavigate();
  return (
    <>
    {users?.map((user: Models.Document, i:number)=>{
        return(
        <div key={i} className={`${userId === user.$id?'hidden':''} bg-dark-1 border border-gray-700 rounded-[34px] p-8 flex flex-col gap-4 w-28 h-28 lg:w-52 lg:h-64 items-center`}>
        <img src={user.imageUrl || '/assets/images/profile.png'} alt="user-profile" className='rounded-full h-16 w-16'/>
        <div className='flex flex-col'>
            <p className='text-sm lg:text-lg font-bold hidden lg:block'>{user.username}</p>
            <p className='text-light-4 text-center hidden lg:block'>@{user.name}</p>
        </div>
        <Button
        onClick={()=>{
          navigate(`/profile/${user.$id}`);
        }}
        className="shad-button_primary whitespace-nowrap font-bold">Visit user</Button>
    </div>
    )})}
    </>
  )
}

export default PeopleCard
