import { useAppDispatch,useAppSelector } from '@/app/store'
import { fetchPosts } from '@/features/postsSlice'
import { useEffect } from "react";
import { Link } from 'react-router-dom';

const Blogcard = () => {
    const dispatch = useAppDispatch();
    const blogs = useAppSelector((state) => state.posts)

    useEffect(() => {
        dispatch(fetchPosts())
    },[dispatch])

    return(
        <> 
            <div>
                {blogs.posts.map(blog => (
                    <div key={blog.id}>
                        <Link to={`/post/${blog.post_id}`}>
                            <h3>
                                {blog.title}
                            </h3>
                        </Link>
                        {/* <h3>
                            {blog.title}
                        </h3> */}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Blogcard;