import { useAppDispatch,useAppSelector } from '@/app/store'
import { fetchPosts, setPage } from '@/features/posts/postsSlice'
import { useEffect } from "react";
import Blogs from '../components/common/Blogs';
// import { Link } from 'react-router-dom';

const Blogcard = () => {
    const dispatch = useAppDispatch();
    const {posts, loading, error} = useAppSelector((state) => state.posts)
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
            <div className='flex flex-col w-full max-w-2xl px-5 min-h-[60vh] mx-auto'>
                <Blogs posts={posts} loading={loading} error={error} />
                <div className='flex flex-row justify-center mt-auto '>
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