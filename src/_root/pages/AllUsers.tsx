import { useGetUsers } from '../../lib/react-query/queriesAndMutations'
import Loader from '../../components/shared/Loader';
import PeopleCard from '../../components/shared/PeopleCard';
import { useUserContext } from '../../context/AuthContext';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

function AllUsers() {
  const {data:creators, hasNextPage, fetchNextPage, isFetchingNextPage} = useGetUsers();
  const {user:actualUser} = useUserContext();
  const {ref, inView} = useInView();
  
  useEffect(()=>{
    if(inView)fetchNextPage();
  }, [inView]);
  
  if(isFetchingNextPage || !creators)return <Loader/>

  
  
  return (
    <div className='flex flex-col w-full gap-4 px-2 md:px-[74px]'>
      <div className='flex gap-3 justify-start w-full  pt-10 items-center'>
        <img src="/assets/icons/people.svg" alt="people" className='w-10 h-10' />
        <p className='h3-bold lg:h2-bold'>All Users</p>
      </div>
      <div className='gap-5 grid w-full grid-cols-1 xl:grid-cols-3'>
          {creators.pages.map((item, i:number)=>(
            <PeopleCard key={i} userId={actualUser.id} users={item?.documents}/>
          ))}
      </div>
      {hasNextPage && (
        <div ref={ref}>
          <Loader/>
        </div>
      )}
    </div>
  )
}

export default AllUsers
