// import { useState } from "react";
// import { supabase } from "@/services/supabaseClient";
import Readonlyeditor from "@/components/tiptap-templates/simple/Readonlyeditor";
import { useParams } from "react-router-dom";
import { useAppSelector,useAppDispatch } from "@/app/store";
import { useEffect } from "react";
import { fetchPosts } from "@/features/postsSlice";

const Viewpost = () => {
    const dispatch = useAppDispatch()
    const params = useParams()

    const blogs = useAppSelector((state) => state.posts.posts.find(p => p.post_id === params.postId))


    useEffect(() => {
        dispatch(fetchPosts())
    },[dispatch])


    return (
        <>
        <article>
            {blogs?.title}
            {blogs?.id}
            <Readonlyeditor postContent={blogs?.body}/>
        </article>
        </>
    );
};

export default Viewpost;