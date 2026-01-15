import { useAppDispatch,useAppSelector } from '@/app/store'
import { fetchPosts } from '@/features/postsSlice'
import { useEffect } from "react";

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
                        <h3>
                            {blog.title}
                        </h3>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Blogcard;