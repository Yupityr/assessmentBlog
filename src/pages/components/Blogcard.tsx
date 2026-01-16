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
            <div>
                {blogs.posts.map(blog => (
                    <div className='flex flex-row' key={blog.id}>
                        <Link className='mx-2' to={`/post/${blog.post_id}`}>
                            <h3>
                                {blog.title}
                            </h3>
                        </Link>
                        <Link className='mx-2' to={`/post/edit/${blog.post_id}`}>
                            <h3>
                                Edit
                            </h3>
                        </Link>
                        {/* <h3>
                            {blog.title}
                        </h3> */}
                    </div>
                ))}
                <div className='flex flex-row justify-center my-4'>
                    <button disabled={currentPage === 1} onClick={() => dispatch(setPage(currentPage - 1))}>
                        Prev
                    </button>
                    <p className='content-center mx-4'>{currentPage} of {totalPages}</p>
                    <button onClick={() => dispatch(setPage(currentPage + 1))}>
                         Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default Blogcard;