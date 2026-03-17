// import { useState } from "react";
// import { supabase } from "@/services/supabaseClient";
import Readonlyeditor from "@/components/tiptap-templates/simple/Readonlyeditor";
import { useParams } from "react-router-dom";
import { useAppSelector,useAppDispatch } from "@/app/store";
import { useEffect } from "react";
import { fetchPostsById } from "@/features/posts/postsSlice";

const Viewpost = () => {
    const dispatch = useAppDispatch()
    const params = useParams()

    const blogs = useAppSelector((state) => state.posts.posts.find(p => p.post_id === params.postId))


    useEffect(() => {
        const postId = params.postId
        if (postId){
            dispatch(fetchPostsById(postId))
        }
    },[dispatch, params.postId])


    return (
        <>
        <article className="mx-auto p-4">
            <div className="border-b border-gray-300 mb-4">
                <p className="text-center text-3xl mb-4 pb-4">
                    {blogs?.title}
                </p>
            </div>
            {blogs?.body && 
            <Readonlyeditor postContent={blogs?.body}/>
            }
        </article>
        </>
    );
};

export default Viewpost;