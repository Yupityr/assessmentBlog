// import { useState } from "react";
// import { supabase } from "@/services/supabaseClient";
import Readonlyeditor from "@/components/tiptap-templates/simple/Readonlyeditor";
import { useParams } from "react-router-dom";
import { useAppSelector,useAppDispatch } from "@/app/store";
import { useEffect } from "react";
import { fetchPostsById } from "@/features/postsSlice";
import Comments from "@/components/posts/Comments";
import Loader from "@/components/common/Loader";

const Viewpost = () => {
    const dispatch = useAppDispatch()
    const params = useParams()

    const {posts} = useAppSelector((state) => state.posts)


    useEffect(() => {
        const postId = params.postId
        if (postId){
            dispatch(fetchPostsById(postId))
            console.log();
            
        }
    },[dispatch, params.postId])


    return (
        <>
        {posts.map(blogs => (
            <>
            {!blogs.profiles && <Loader /> }
            {blogs.profiles &&
            <article className="mx-auto p-4">
                <div className="border-b border-gray-300 mb-4">
                    <p className="text-center text-3xl mb-4 pb-4">
                        {blogs?.title}
                    </p>
                    <div className="flex justify-between">
                        <div className="flex flex-row gap-1">
                                <img
                                    src={blogs?.profiles?.avatar_url ?? "https://wxlokatxrwhwpyvgcpre.supabase.co/storage/v1/object/public/blogBucket/output-onlinepngtools.png"}
                                    alt="Profile"
                                    className="h-9 w-9 rounded-full border"
                                />
                                <span className="m-auto">
                                {blogs?.profiles.username}
                                </span>
                        </div>
                        {new Date(blogs.created_at).toLocaleString()}
                    </div>
                </div>
                <div className="min-h-full">
                    {blogs?.body && 
                    <>
                    <Readonlyeditor postContent={blogs?.body}/>
                    <div className="mx-auto p-auto">
                        <section className="text-[8px] sm:text-xs items-start font-bold sm:px-5">
                            <h1 className=" header-text my-2">Comments</h1>
                        </section>
                        <Comments postId={blogs?.post_id} />
                    </div>
                    </>
                    }
                    {/* commment section */}
                    
                </div>
            </article>}</>
        ))}
        </>
    );
};

export default Viewpost;