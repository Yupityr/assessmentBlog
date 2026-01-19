import {createSlice, createAsyncThunk, type PayloadAction} from "@reduxjs/toolkit"
import { supabase } from "@/services/supabaseClient";
import type { RootState } from "@/app/store";
// import { Editor } from "@tiptap/react"

export interface Post{
    id:number,
    title:string;
    body:any;
    post_id:string
    user_id:string
}

export interface paginationType{
    postPerPage:number,
    currentPage:number,
    totalPages:number,
    totalItems:number
}

const initialPaginationState = {
    postPerPage:5,
    currentPage: 1,
    totalPages:1,
    totalItems:0
}

interface PostsState{
    posts:Post[];
    total:number;
    currentPost: Post| null;
    pagination:paginationType;
}

const initialState:PostsState = {
    posts:[],
    total:0,
    currentPost:null,
    pagination:initialPaginationState
}

const postSlice = createSlice({
    name:"post",
    initialState,
    reducers:{
        setPage: (state, action:PayloadAction<number>) => {
            state.pagination.currentPage = action.payload
        },
    },
    extraReducers:(builder) => {
        builder
        .addCase(createPost.fulfilled, (state,action) => {
            state.posts = action.payload;
        })
        .addCase(fetchPosts.fulfilled, (state,action) => {
            state.posts = action.payload.posts ?? [];
            state.pagination.totalItems = action.payload.total
            state.pagination.totalPages = Math.ceil(action.payload.total / state.pagination.postPerPage)

            // state.pagination.totalPages = Math.ceil(action.payload.pagination.totalItems / action.payload.pagination.postPerPage);
        })
        .addCase(fetchPostsByUserId.fulfilled, (state,action) => {
            state.posts = action.payload.posts ?? [];
            state.pagination.totalItems = action.payload.total
            state.pagination.totalPages = Math.ceil(action.payload.total / state.pagination.postPerPage)

            // state.pagination.totalPages = Math.ceil(action.payload.pagination.totalItems / action.payload.pagination.postPerPage);
        })
        .addCase(updatePost.fulfilled, (state, action) => {
            const index = state.posts.findIndex(
                post => post.post_id === action.payload.post_id
            )

            if (index !== -1) {
                state.posts[index] = action.payload
            }
            console.log("hello");
        })
        .addCase(deletePost.fulfilled, (state,action) => {
            state.posts= state.posts.filter(post => post.post_id !== action.payload)
        })
    }
});


export const fetchPosts = createAsyncThunk<{posts:Post[]; pagination:paginationType,total:number,user_id:string},string, {state:RootState}>('posts/fetchPosts',
    async (userId, {getState}) => {
        const { currentPage, postPerPage} = getState().posts.pagination;

        const from = (currentPage - 1) * postPerPage
        const to = from + postPerPage - 1
        
        const {data, count, error} = await supabase.from('blogs').select('*',{count: "exact"}).range(from,to).order('created_at', {ascending:false});

        if (error) {
            throw new Error(error.message);
        }
        if (!data) {
            throw new Error('No data found');
        }
        return {
        posts: data,
        pagination: getState().posts.pagination,
        total: count ?? 0,
        user_id: userId
        }
    }
)

export const fetchPostsByUserId = createAsyncThunk<{posts:Post[]; pagination:paginationType,total:number,user_id:string},string , {state:RootState,rejectValue: string}>('posts/fetchPostsByUserId',
    async (userId, {getState, rejectWithValue}) => {
        const { currentPage, postPerPage} = getState().posts.pagination;

        const from = (currentPage - 1) * postPerPage
        const to = from + postPerPage - 1
        
        const {data, count, error} = await supabase.from('blogs').select('*',{count: "exact"}).eq('user_id', userId).range(from,to).order('created_at', {ascending:false});

        if (error) {
            return rejectWithValue(error.message)
        }

        if (!data) {
            return rejectWithValue('No data found')
        }

        return {
        posts: data,
        pagination: getState().posts.pagination,
        total: count ?? 0,
        user_id: userId ?? ''
        };
    }
)


export const createPost = createAsyncThunk('posts/createPosts',
    async (newPost: {title: string; body:any; }) => {
        const {data, error} = await supabase.from('blogs').insert([newPost]);

        if (error) {
            throw new Error(error.message);
        }

        if (!data) {
            throw new Error('No data returned from the insert operation.');
        }

        return data;
        
    }
)

export const updatePost = createAsyncThunk<Post,{ post_id: string | undefined; title: string | undefined; body: any}>('posts/updatePost',
    async ({ post_id, title, body }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from('blogs')
      .update({ title, body })
      .eq('post_id', post_id)
      .select()
      .single()

    if (error) {
      return rejectWithValue(error.message)
    }

    return data
  }
)

export const deletePost = createAsyncThunk<string, string>('posts/deletePost',
    async(post_id, {rejectWithValue}) => {
        const {error} = await supabase
        .from('blogs')
        .delete()
        .eq('post_id', post_id)

        if (error) {
            return rejectWithValue(error)
        }

        return post_id
    }
)




export default postSlice.reducer;
export const {setPage} = postSlice.actions
