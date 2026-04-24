import { configureStore } from '@reduxjs/toolkit'
import { type TypedUseSelectorHook,useDispatch,useSelector } from 'react-redux'
import postsReducer from '@/features/postsSlice'

const store = configureStore({
  reducer: {
    posts: postsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export {store};