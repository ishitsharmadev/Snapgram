import { Models } from 'appwrite'
import React from 'react'
import Loader from './Loader'
import GridPostsList from './GridPostsList'

type SearcResultProps = {
  isSearchFetching:boolean,
  searchedPosts?: Models.Document[]
}

function SearchResults({
  isSearchFetching,
  searchedPosts
}:SearcResultProps) {

  if(isSearchFetching)return <Loader/>
  if(searchedPosts && searchedPosts.length >0) return <GridPostsList posts={searchedPosts}/>

  return (
    <p className='text-light-4 mt-10 text-center w-full'>No results found</p>
  )
}

export default SearchResults
