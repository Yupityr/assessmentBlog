import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

// --------------------
// Types
// --------------------
export interface Comment {
  id: string;
  content: string;
  user_id: string;
  profiles:{
    username:string;
    avatar_url:string;
    email:string;
  } | null;
  post_id: string;
  created_at: string;
}

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

// --------------------
// Thunks
// --------------------

// CREATE
export const createComment = createAsyncThunk<
  Comment,
  { content: string; post_id: string; user_id: string | undefined; },
  { rejectValue: string }
>("comments/createComment", async (payload, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("comments")
    .insert([payload])
    .select()
    .single();

  if (error) return rejectWithValue(error.message);
  return data;
});

// EDIT
export const editComment = createAsyncThunk<
  Comment,
  { id: string; content: string },
  { rejectValue: string }
>("comments/editComment", async ({ id, content }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", id)
    .select()
    .single();

  if (error) return rejectWithValue(error.message);
  return data;
});

// DELETE
export const deleteComment = createAsyncThunk<
  string, // return deleted id
  { id: string },
  { rejectValue: string }
>("comments/deleteComment", async ({ id }, { rejectWithValue }) => {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", id);

  if (error) return rejectWithValue(error.message);
  return id;
});

export const fetchCommentsByPostId = createAsyncThunk<
  Comment[],
  string,
  { rejectValue: string }
>("comments/fetchByPostId", async (postId, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("comments")
    .select(`
        *,
        profiles (
          username,
          avatar_url,
          email
        )
      `)
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error) {
    return rejectWithValue(error.message);
  }

  if (!data) {
    return [];
  }

  return data;
});


const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    // optional local reducers
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.loading = false;
        state.comments.unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create comment";
      })

      // EDIT
      .addCase(editComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.loading = false;
        const index = state.comments.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(editComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to edit comment";
      })

      // DELETE
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.comments = state.comments.filter(c => c.id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete comment";
      })


      // fetch
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.loading = true;
        state.error = null;
        })

        .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
        state.loading = false;

        // replace comments with fetched ones
        state.comments = action.payload;
        })

        .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch comments";
        })
        },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;