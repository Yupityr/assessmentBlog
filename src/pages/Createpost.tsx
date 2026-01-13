import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Editor } from "@tiptap/react"
import { useState } from "react"

export const Createpost = () => {
    const [editor, setEditor] = useState<Editor | null>(null);

    
    const createPost = () => {
        console.log(editor?.getJSON());
    };

    return (
        <>
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