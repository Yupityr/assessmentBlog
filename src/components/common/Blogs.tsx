import type { PostsState } from '@/features/posts/postsSlice';
import { useNavigate } from 'react-router-dom';
import { deletePost } from "@/features/posts/postsSlice";
type BlogsProps = Pick<PostsState, 'posts' | 'loading' | 'error'>;
import { useAppDispatch } from "@/app/store";
import { useParams } from "react-router-dom";
import Loader from './Loader';

const Blogs = ({posts, loading, error}: BlogsProps) => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const params = useParams()

    return (
        <>
            {loading && <Loader /> }
            {posts.length === 0 && !loading && !error && <p className="text-center">No posts found.</p>}
            {error && <div className="text-center text-red-500"> <p>Eror Occurred</p> <p>Redirecting back to homepage</p></div>}
            {!loading && !error && 
            <div className='flex flex-col w-full'>
                {posts?.map(blog => (
                    <>
                        <div onClick={() =>navigate(`/post/${blog.post_id}`)} className='group flex flex-row p-6 my-3 ease-in-out hover:scale-[1.01] cursor-pointer' key={blog.post_id}>
                            <div className='flex flex-row gap-4 w-full'>
                                <div className="flex flex-col ">
                                    <h3 className='text-xl md:text-lg'>
                                        {blog.title}
                                    </h3>
                                    <span>
                                        {new Date(blog.created_at).toLocaleString()}
                                    </span>
                                    
                                </div>
                            </div>
                            {params.userId === blog.user_id && 
                            <div className="flex items-center space-x-4">
                                <button onClick={() =>navigate(`/post/edit/${blog.post_id}`)}>
                                    Edit
                                </button>
                                <button onClick={() => dispatch(deletePost(blog.post_id))}>
                                    Delete
                                </button>
                            </div>}
                        </div>
                        <div className="h-px bg-gray-500 opacity-20" />
                    </>
                ))}
            </div>}
        </>
    );
};

export default Blogs;