import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Editor } from "@tiptap/react"
import { useState } from "react"
import { supabase } from "@/services/supabaseClient"


export const Createpost = () => {
    const [editor, setEditor] = useState<Editor | null>(null);
    const [blog, setBlog] = useState({title: "", body: ""});
    
    const createPost = async (e:any) => {
        e.preventDefault()

        const payload = {
            title: blog.title,
            body: editor?.getJSON(),
        }

        const {error} = await supabase.from("blogs").insert(payload)

        if (error) {
            console.error("Failed to create post", error)
            return
        }

    };

    
    const check = () =>{
        const payload = {
            title: blog.title,
            body: editor?.getJSON(),
        }
        console.log(payload);
        
    }
    

    return (
        <>
            <input type="text" placeholder="Insert Title" onChange={(e) => setBlog((prev) => ({...prev, title: e.target.value}))}/>
            <div >
                <div className="flex justify-end">
                    <button onClick={createPost}>
                        Post
                    </button>
                </div>
                <SimpleEditor onEditorReady={setEditor} />
            </div>
        </>
    );
}