import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { supabase } from "@/services/supabaseClient";
import type { RootState } from "@/app/store";

export interface Post{
    id:string,
    title:string;
    body:any;
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
        onNextPage: () => {},
        onPrevPage: () => {}
    },
    extraReducers:(builder) => {
        builder
        .addCase(createPost.fulfilled, (state,action) => {
            state.posts = action.payload;
        })
        .addCase(fetchPosts.fulfilled, (state,action) => {
            state.posts = action.payload.posts;
            console.log(action.payload.total);
            state.pagination.totalItems = action.payload.total
            state.pagination.totalPages = Math.ceil(action.payload.total / state.pagination.postPerPage)
            console.log(state.pagination.totalPages);
            
            // state.pagination.totalPages = Math.ceil(action.payload.pagination.totalItems / action.payload.pagination.postPerPage);
        })
    }
});


export const fetchPosts = createAsyncThunk<{posts:Post[]; pagination:paginationType,total:number},void, {state:RootState}>('posts/fetchPosts',
    async (_, {getState}) => {
        try {
            const { currentPage, postPerPage} = getState().posts.pagination;

            const from = (currentPage - 1) * postPerPage
            const to = from + postPerPage - 1
            
            const {data, count} = await supabase.from('blogs').select('*',{count: "exact"}).range(from,to).order('created_at', {ascending:false});

            return {posts:data,total:count}
        } catch (error:any){
            return error
        }
    }
)

export const createPost = createAsyncThunk('posts/createPosts',
    async (newPost: {title: string; body:any; }) => {
        try {
           
            const {data,error} = await supabase.from('blogs').insert([newPost]);
            if(error)throw error;
            return data;
            
        } catch (error:any){
            return error
        }
    }
)



export default postSlice.reducer;
