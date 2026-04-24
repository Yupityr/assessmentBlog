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
import { fetchPostsById } from "@/features/postsSlice";
import { useNavigate } from "react-router-dom";
import Createpostheader from "@/components/common/Createpostheader";

const Updatepost = () => {
    const dispatch = useAppDispatch()
    const params = useParams()
    const navigate = useNavigate()
    const blogs = useAppSelector((state) => state.posts.posts.find(p => p.post_id === params.postId))
    
    const [title, setTitle] = useState("")
    const [body,setBody] = useState<Editor | null>(null)

    useEffect(() => {
        const postId = params.postId
        if (postId){
            dispatch(fetchPostsById(postId))
        }
    },[dispatch, params.postId])    

    const saveEdit = (status: 'published' | 'draft') =>{
        setTimeout(() => {
            navigate(`/user/${blogs?.user_id}`)
        }, 1000);
        return dispatch(updatePost({
            post_id:params.postId,
            title:title,
            body:body?.getJSON(),
            status
        }))
    }

    useEffect(() => {
    if (blogs?.title) {
        setTitle(blogs.title);
        console.log("test");
        
    }
    }, [blogs]);
    


    return (
        <>
            <Createpostheader onPost={saveEdit} disabled={!title}/>
            <div className="flex justify-between my-2 mx-4 ">
                <input id="title" value={title ?? ""} className="text-3xl" type="text" onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <article>
                {blogs?.body &&
                <Editonlyeditor onEditorReady={setBody} postContent={blogs?.body}/>}
            </article>
        </>
    );
};

export default Updatepost;