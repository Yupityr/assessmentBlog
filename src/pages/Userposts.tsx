
import { useParams } from "react-router-dom";
import { useAppSelector,useAppDispatch } from "@/app/store";
import { useEffect } from "react";
import { deletePost, setPage,fetchPostsByUserId } from "@/features/postsSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



const Userposts = () => {
    
    const dispatch = useAppDispatch()
    const params = useParams()
    const {posts, loading, error} = useAppSelector((state) => state.posts)
    
    const navigate = useNavigate()

    const { currentPage } = useAppSelector(
    state => state.posts.pagination
    )
    const { totalPages } = useAppSelector(
    state => state.posts.pagination
    )

    useEffect(() => {
        const userId = params.userId;
        if (userId){
            dispatch(fetchPostsByUserId(userId))
            console.log(userId);
        }
    },[dispatch, params.userId])

    return (
        <>
            <div className="flex flex-col">
                {loading && <p>Loading...</p> }
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && posts.map(blog => (
                    <div className='flex flex-row bg-white border border-gray-200 rounded-lg p-6 shadow-sm' key={blog.id}>
                        <div className='flex flex-row justify-between'>
                            <div className="flex items-center">
                                <Link className='' to={`/post/${blog.post_id}`}>
                                    <h3>
                                        {blog.title}
                                    </h3>
                                </Link>
                            </div>
                            <div className="flex">
                                <button onClick={() =>navigate(`/post/edit/${blog.post_id}`)}>
                                    Edit
                                </button>
                                <button onClick={() => dispatch(deletePost(blog.post_id))}>
                                    Delete
                                </button>
                            </div>
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

export default Userposts