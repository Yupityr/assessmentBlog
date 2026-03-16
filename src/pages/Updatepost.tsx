// import { useState } from "react";
// import { supabase } from "@/services/supabaseClient";
// import Readonlyeditor from "@/components/tiptap-templates/simple/Readonlyeditor";
import { useParams } from "react-router-dom";
import { useAppSelector,useAppDispatch } from "@/app/store";
import { useEffect,useState } from "react";
import { updatePost } from "@/features/posts/postsSlice";
// import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Editor } from "@tiptap/react"
import {Editonlyeditor} from "@/components/tiptap-templates/simple/Editonlyeditor";
import { fetchPosts } from "@/features/posts/postsSlice";
import { useNavigate } from "react-router-dom";
import Createpostheader from "@/components/common/Createpostheader";

const Updatepost = () => {
    const dispatch = useAppDispatch()
    const params = useParams()
    const navigate = useNavigate()
    const blogs = useAppSelector((state) => state.posts.posts.find(p => p.post_id === params.postId))

    const initialTitle = blogs?.title
    
    const [title, setTitle] = useState(initialTitle)
    const [body,setBody] = useState<Editor | null>(null)

    useEffect(() => {
        dispatch(fetchPosts())
    },[dispatch])    

    const saveEdit = (status: 'published' | 'draft') =>{
        setTimeout(() => {
            navigate(`/post/user/${blogs?.user_id}`)
        }, 1000);
        return dispatch(updatePost({
            post_id:params.postId,
            title:title,
            body:body?.getJSON(),
            status
        }))
    }


    return (
        <>
        <Createpostheader onPost={saveEdit} disabled={!title}/>
        <div className="flex justify-between my-2 mx-4 ">
            <input id="title" value={title} className="text-3xl" type="text" onChange={(e) => setTitle(e.target.value)}/>
        </div>
            <article>
                
                <Editonlyeditor onEditorReady={setBody} postContent={blogs?.body}/>
            </article>
        </>
    );
};

export default Updatepost;