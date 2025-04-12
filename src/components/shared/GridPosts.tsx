import { Models } from 'appwrite'
import { Link } from 'react-router-dom';

type GridPostListProps =  {
    posts: Models.Document[],
    showUser?: boolean,
    className?: string
}

function GridPosts({
    posts, 
    showUser = false, 
    className = ''
}: GridPostListProps) {
   
    return (
        <div className='w-full h-full'>
            <ul className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
                {posts.map((post: Models.Document) => (
                    <li 
                        key={post.$id} 
                        className='relative group overflow-hidden rounded-xl'
                    >
                        <Link to={`/posts/${post.$id}`} className='block relative'>
                            <div className='relative pt-[100%]'>
                                <img 
                                    src={post.imageUrl || '/assets/icons/profile-placeholder.svg'}
                                    className='absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                                    alt="post"
                                />
                            </div>

                            {showUser && (
                                <div className='absolute top-2 left-2 flex items-center'>
                                    <img 
                                        src={post.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                                        alt="creator"
                                        className='w-8 h-8 rounded-full border-2 border-white'
                                    />
                                    <p className='ml-2 text-sm text-white font-medium drop-shadow-md'>
                                        {post.creator?.name}
                                    </p>
                                </div>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default GridPosts