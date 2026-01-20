import { Link } from 'react-router-dom';
const Blogs = ({Blogs}) => {

    const blogs = Blogs;

    return (
        <div className='flex flex-col w-full max-w-lg px-5 min-h-[60vh] mx-auto'>
            {blogs.posts?.map(blog => (
                <div className='flex flex-row border border-gray-200 rounded-lg p-6 shadow-sm my-5' key={blog.post_id}>
                    <div className='flex flex-row'>
                        <Link className='mx-2' to={`/post/${blog.post_id}`}>
                            <h3>
                                {blog.title}
                            </h3>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Blogs;