import type { PostsState } from '@/features/posts/postsSlice';
import { useNavigate } from 'react-router-dom';
import { deletePost } from "@/features/posts/postsSlice";
type BlogsProps = Pick<PostsState, 'posts' | 'loading' | 'error'>;
import { useAppDispatch } from "@/app/store";
import { useParams } from "react-router-dom";
import Loader from './Loader';
import Deletemodal from './Deletemodal';
import { useState } from 'react';

const Blogs = ({posts, loading, error}: BlogsProps) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const params = useParams()

    const handleDeleteClick = (e, deleteId) => {
        e.stopPropagation();
        setSelectedPostId(deleteId);
        setIsModalOpen(true);
        console.log("test");
        
    };

    const confirmDelete = () => {
            dispatch(deletePost(selectedPostId));
            setIsModalOpen(false);
            setSelectedPostId(null);
        };

    return (
        <>
            {loading && <Loader /> }
            
            {error && <div className="text-center text-red-500"> <p>Eror Occurred</p> <p>Redirecting back to homepage</p></div>}
            {!loading && !error && 
            <div className='flex flex-col w-full'>
                {posts.length === 0 && !loading && !error && <span className="flex justify-center items-center min-h-[60vh]">No posts found.</span>}
                {posts?.map(blog => (
                    <>
                        <div onClick={() =>navigate(`/post/${blog.post_id}`)} className='group relative overflow-hidden flex flex-row p-6 my-3 ease-in-out cursor-pointer' key={blog.post_id}>
                            <div className='flex flex-row gap-4 w-full'>
                                <div className="flex flex-col ">
                                    <h3 className='text-xl md:text-lg'>
                                        {blog.title}
                                    </h3>
                                    <span className='text-xs'>
                                        {new Date(blog.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            {params.userId === blog.user_id && 
                            <div className="flex items-center space-x-4">
                                <button onClick={(e) =>{
                                    navigate(`/post/edit/${blog.post_id}`);
                                    e.stopPropagation()}}>
                                    Edit
                                </button>
                                <button onClick={(e) => handleDeleteClick(e, blog.post_id)}>
                                    Delete
                                </button>
                                <Deletemodal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    onConfirm={confirmDelete}
                                    title="Delete Post"
                                >
                                    Are you sure you want to delete this post?
                                </Deletemodal>
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