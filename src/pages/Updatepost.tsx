// import { useState } from "react";
// import { supabase } from "@/services/supabaseClient";
// import Readonlyeditor from "@/components/tiptap-templates/simple/Readonlyeditor";
import { useParams } from "react-router-dom";
import { useAppSelector,useAppDispatch } from "@/app/store";
import { useEffect,useState } from "react";
import { updatePost } from "@/features/postsSlice";
// import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Editor } from "@tiptap/react"
import {Editonlyeditor} from "@/components/tiptap-templates/simple/Editonlyeditor";
import { fetchPosts } from "@/features/postsSlice";

const Updatepost = () => {
    const dispatch = useAppDispatch()
    const params = useParams()

    const blogs = useAppSelector((state) => state.posts.posts.find(p => p.post_id === params.postId))

    const initialTitle = blogs?.title
    
    const [title, setTitle] = useState(initialTitle)
    const [body,setBody] = useState<Editor | null>(null)

    useEffect(() => {
        dispatch(fetchPosts())
    },[dispatch])    



    // useEffect(() => {
    //     dispatch(updatePost({
    //         id:params.postId,
    //         title:title,
    //         content:body
    //     }
    //     ))
    // })

    // useEffect(() => {
    //     if (blogs){
    //         setBody(blogs.body)
    //         setTitle(blogs.title)
    //     }
    // },[blogs])

    const saveEdit = () =>{
        
        return dispatch(updatePost({
            post_id:params.postId,
            title:title,
            body:body?.getJSON()
        }))
    }


    return (
        <>
        <button onClick={saveEdit}>
            Save
        </button>
        <article>
            <input id="title" value={title} className="text-3xl" type="text" onChange={(e) => setTitle(e.target.value)}/>
            <Editonlyeditor onEditorReady={setBody} postContent={blogs?.body}/>
        </article>
        </>
    );
};

export default Updatepost;