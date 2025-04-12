import React, { useState, useEffect } from 'react'
import { Input } from '../../components/ui/input'
import { Models } from 'appwrite';
import GridPostsList from '../../components/shared/GridPostsList';
import SearchResults from '../../components/shared/SearchResults';
import { useGetPosts, useSearchPosts } from '../../lib/react-query/queriesAndMutations';
import useDebounce from '../../hooks/useDebounce';
import Loader from '../../components/shared/Loader';
import { useInView } from "react-intersection-observer";

function Explore() {

  const {ref, inView} = useInView() 
  const {data:posts, hasNextPage, fetchNextPage} = useGetPosts();
  const [searchValue, setSearchValue] = useState('');
  const debounceValue = useDebounce(searchValue, 500);
  const {data:searchedPosts, isPending:isSearchFetching} = useSearchPosts(debounceValue);// As this is a tiring request which is not good for our database we want to call the fn after cetain millisec so we use debounce

  useEffect(()=>{
    if(inView && !searchValue) fetchNextPage()
  }, [inView, searchValue])

  if(!posts){
    return(
      <div className="w-full h-full flex-center">
        <Loader/>
      </div>
    )
  }

  const shouldShowSearchResults = searchValue!=='';
  const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((item)=>item?.documents.length === 0);
  
  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>Search Posts</h2>
        <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
          <img src="/assets/icons/search.svg" alt="search" width={24} height={24} />
          <Input
          type='text'
          placeholder='Search'
          className='explore-search'
          value={searchValue}
          onChange={(e)=>setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className='flex-between w-full max-w-5xxl mt-16 mb-7'>
        <h3 className='body-bold md:h3-bold'>Popular Today</h3>
        <div className='flex-center gap-3 bg-dark-3 px-4 py-2 cursor-pointer rounded-xl'>
          <p className='small-medium md:base-medium text-light-2'>All</p>
          <img src="/assets/icons/filter.svg" width={20} height={20} alt="filter" />
        </div>
      </div>
      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
        {shouldShowSearchResults?(
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts?.documents}
          />
        ): shouldShowPosts?(
          <p className='text-light-4 mt-4 text-center w-full'>End of Posts</p>
        ):posts.pages.map((item, i)=>{
          return(
            <GridPostsList key={`page-${i}`} posts={item?.documents}/>
          )
        })}
      </div>
        {/**Infinite fetching */}
        {hasNextPage && !searchValue && (
          <div ref={ref} className='mt-10'>
            <Loader/>
          </div>
        )}

    </div>
  )
}

export default Explore;
