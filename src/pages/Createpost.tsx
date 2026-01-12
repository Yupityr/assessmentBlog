import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Editor } from "@tiptap/react"
import { useState } from "react"

export const Createpost = () => {
    const [editor, setEditor] = useState<Editor | null>(null);

    const json = editor?.getJSON()

    
    const createPost = () => {
        console.log(json);
    };

    return (
        <>
            <div className="flex flex-col gap-4 p-4">
                <SimpleEditor onEditorReady={setEditor} />
                <div className="flex justify-end">
                    <button onClick={createPost}>
                        Post
                    </button>
                </div>
            </div>
        </>
    );
}