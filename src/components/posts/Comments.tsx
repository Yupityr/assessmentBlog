import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { createComment, fetchCommentsByPostId } from "@/features/commentsSlice"
import { useSession } from "@/context/AuthContext";

type CommentsProps = {
  postId: string;
};

const Comments = ({ postId }: CommentsProps) => {
  const {session} = useSession();
  const dispatch = useAppDispatch();

  const comments = useAppSelector(
    (state) => state.comments.comments
  );

  const loading = useAppSelector(
    (state) => state.comments.loading
  );

  const [text, setText] = useState("");

  // fetch comments on mount / post change
  useEffect(() => {
    if (postId) {
      dispatch(fetchCommentsByPostId(postId));
    }
  }, [postId, dispatch]);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    await dispatch(
      createComment({
        content: text,
        post_id: postId,
        user_id: session?.user.id, // replace with auth user
      })
    );

    setText("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      {/* input */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 w-full rounded"
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 rounded"
        >
          Post
        </button>
      </div>

      {/* loading */}
      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      {/* comments list */}
      <div className="flex flex-col gap-3">
        {comments
          .filter((c) => c.post_id === postId)
          .map((comment) => (
            <div
              key={comment.id}
              className="border p-3 rounded shadow-sm"
            >
              <p>{comment.content}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Comments;