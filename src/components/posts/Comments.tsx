import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  createComment,
  editComment,
  deleteComment,
  fetchCommentsByPostId,
} from "@/features/commentsSlice";
import { useSession } from "@/context/AuthContext";
import Loader from "../common/Loader";

type CommentsProps = {
  postId: string;
};

const Comments = ({ postId }: CommentsProps) => {
  const { session } = useSession();
  const dispatch = useAppDispatch();

  const comments = useAppSelector((state) => state.comments.comments);
  const loading = useAppSelector((state) => state.comments.loading);

  const [text, setText] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOwner = (commentUserId: string) =>
    session?.user?.id === commentUserId;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch on mount / postId change
  useEffect(() => {
    if (postId) dispatch(fetchCommentsByPostId(postId));
  }, [postId, dispatch]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await dispatch(
      createComment({ content: text, post_id: postId, user_id: session?.user.id })
    );
    setText("");
  };

  const handleEdit = async (id: string) => {
    if (!editText.trim()) return;
    await dispatch(editComment({ id:id, content: editText }));
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteComment({ id }));
    setOpenDropdownId(null);
  };

  const startEditing = (id: string, currentContent: string) => {
    setEditingId(id);
    setEditText(currentContent);
    setOpenDropdownId(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      {/* Input */}
      {session ? 
      (
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 w-full rounded"
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-4 rounded disabled:opacity-50"
        >
          Post
        </button>
      </div>

      ) : (
      <div className="flex gap-2 mb-4 justify-center">
        <div className="flex flex-col">
          <p>
            User must be logged in to write a comment
          </p>
          <a
            href="/signin"
            className="bg-gray-400 text-white px-4 m-auto rounded flex "
          >
            Sign in
          </a>
        </div>
    </div>)}
      

      {loading && <Loader /> }

      {/* Comments list */}
      <div className="flex flex-col gap-3">
        {comments
          .filter((c) => c.post_id === postId)
          .map((comment) => (
            <div
              key={comment.id}
              className="border p-3 rounded shadow-sm relative"
            >
              {/* Top row */}
              <div className="flex justify-between items-center">
                <div className="flex flex-row">
                  <img
                    src={comment.profiles?.avatar_url}
                    alt="Profile"
                    className="h-9 w-9 rounded-full border"
                  />
                  <p className="font-medium text-sm m-auto pl-1">{comment.profiles?.username}</p>
                </div>
                
                {/* Dropdown trigger */}
                <div className="relative" ref={openDropdownId === comment.id ? dropdownRef : null}>
                  <button
                    onClick={() =>
                      setOpenDropdownId((prev) =>
                        prev === comment.id ? null : comment.id
                      )
                    }
                    className="text-gray-500 hover:text-black w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                    aria-label="Comment options"
                    aria-expanded={openDropdownId === comment.id}
                  >
                    ⋮
                  </button>

                  {/* Dropdown menu */}
                  {openDropdownId === comment.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg w-32 z-20 py-1">
                      {isOwner(comment.user_id) ? (
                        <>
                          <button
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                            onClick={() => startEditing(comment.id, comment.content)}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-500 transition-colors"
                            onClick={() => handleDelete(comment.id)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                          onClick={() => setOpenDropdownId(null)}
                        >
                          Report
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-1">
                {new Date(comment.created_at).toLocaleString()}
              </p>

              {/* Inline edit or content */}
              {editingId === comment.id ? (
                <div className="flex gap-2 mt-1">
                  <input
                    className="border p-1.5 w-full rounded text-sm"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEdit(comment.id);
                      if (e.key === "Escape") setEditingId(null);
                      ;
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => handleEdit(comment.id)}
                    className="bg-black text-white px-3 py-1 rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="border px-3 py-1 rounded text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-sm">{comment.content}</p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Comments;