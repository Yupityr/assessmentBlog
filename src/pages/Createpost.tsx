// import { useDispatch, useSelector} from 'react-redux'
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Editor } from "@tiptap/react"
import { useState } from "react"
// import { supabase } from '@/services/supabaseClient'

// imports for accessing store
import { useAppDispatch } from '@/app/store'
import { createPost } from '@/features/postsSlice'

// export const Createpost = () => {
//     const [editor, setEditor] = useState<Editor | null>(null);
//     const [blog, setBlog] = useState({title: "", body: ""});
    
//     const createPost = async (e:any) => {
//         e.preventDefault()

//         const payload = {
//             title: blog.title,
//             body: editor?.getJSON(),
//         }

//         const {error} = await supabase.from("blogs").insert(payload)

//         if (error) {
//             console.error("Failed to create post", error)
//             return
//         }

//     };

    
//     const check = () =>{
//         const payload = {
//             title: blog.title,
//             body: editor?.getJSON(),
//         }
//         console.log(payload);
        
//     }
    

//     return (
//         <>
            
//             <div >
//                 <div className="flex justify-between my-2 mx-4">
//                     <input className="text-3xl" type="text" placeholder="Insert Title" onChange={(e) => setBlog((prev) => ({...prev, title: e.target.value}))}/>
//                     <button onClick={createPost}>
//                         Post
//                     </button>
//                 </div>
//                 <SimpleEditor onEditorReady={setEditor} />
//             </div>
//         </>
//     );
// }

export const Createpost = () => {
    const dispatch = useAppDispatch()

    const [title, setTitle] = useState('')
    const [body,setBody] = useState<Editor | null>(null)

    const handleSubmit = async () => {
        await dispatch(
            createPost({
                title,body:body?.getJSON()
            })
        )
    }


    return (
        <>
            
            <div >
                <div className="flex justify-between my-2 mx-4">
                    {/* <input className="text-3xl" type="text" placeholder="Insert Title" onChange={(e) => setBlog((prev) => ({...prev, title: e.target.value}))}/> */}
                    <input id="title" className="text-3xl" type="text" placeholder="Insert Title" onChange={(e) => setTitle(e.target.value)}/>
                    <button disabled={!title} onClick={handleSubmit}>
                        Post
                    </button>
                </div>
                <SimpleEditor onEditorReady={setBody} />
            </div>
        </>
    );
}