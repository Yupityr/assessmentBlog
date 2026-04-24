import { configureStore } from '@reduxjs/toolkit'
import { type TypedUseSelectorHook,useDispatch,useSelector } from 'react-redux'
import postsReducer from '@/features/postsSlice'
import commentReducer from '@/features/commentsSlice'

const store = configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export {store};