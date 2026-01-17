import { useAppDispatch,useAppSelector } from '@/app/store'
import { fetchPosts, setPage } from '@/features/postsSlice'
import { useEffect } from "react";
import { Link } from 'react-router-dom';

const Blogcard = () => {
    const dispatch = useAppDispatch();
    const blogs = useAppSelector((state) => state.posts)
    const { currentPage } = useAppSelector(
    state => state.posts.pagination
    )
    const { totalPages } = useAppSelector(
    state => state.posts.pagination
    )

    useEffect(() => {
        dispatch(fetchPosts())
    },[currentPage, dispatch, totalPages])

    return(
        <> 
            <div className=''>
                {blogs.posts?.map(blog => (
                    <div className='flex flex-row bg-white border border-gray-200 rounded-lg p-6 shadow-sm my-5' key={blog.post_id}>
                        <div className='flex flex-row'>
                            <Link className='mx-2' to={`/post/${blog.post_id}`}>
                                <h3>
                                    {blog.title}
                                </h3>
                            </Link>
                            
                        </div>
                    </div>
                ))}
                <div className='flex flex-row justify-center my-4'>
                    <button disabled={currentPage === 1} onClick={() => dispatch(setPage(currentPage - 1))}>
                        Prev
                    </button>
                    <p className='content-center mx-4'>{currentPage} of {totalPages}</p>
                    <button disabled={currentPage === totalPages} onClick={() => dispatch(setPage(currentPage + 1))}>
                         Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default Blogcard;