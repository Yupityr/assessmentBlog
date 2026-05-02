import Blogs from "@/components/common/Blogs"
import { useAppDispatch,useAppSelector } from '@/app/store'
import { fetchPosts, setPage } from '@/features/postsSlice'
import { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"

const Search = () => {
    const params = useParams()
    const searchInput = params.searchInput
    const dispatch = useAppDispatch();
    const {posts, loading, error} = useAppSelector((state) => state.posts)
    const filteredPosts = useMemo(() => posts.filter(p => p.title.toLowerCase().includes(searchInput?.toLocaleLowerCase() || "")
    ),[posts, searchInput]
    );
    const { currentPage } = useAppSelector(
    state => state.posts.pagination
    )
    const { totalPages } = useAppSelector(
    state => state.posts.pagination
    )

    
    
    useEffect(() => {
            dispatch(fetchPosts())
        },[currentPage, dispatch, totalPages])

    return (
        <div>
        <Blogs posts={filteredPosts} loading={loading} error={error} />
        { posts.length > 0 && <div className='flex flex-row justify-center mt-auto '>
                            <button disabled={currentPage === 1} onClick={() => dispatch(setPage(currentPage - 1))}>
                                Prev
                            </button>
                            <p className='content-center mx-4'>{currentPage} of {totalPages}</p>
                            <button disabled={currentPage === totalPages} onClick={() => dispatch(setPage(currentPage + 1))}>
                                 Next
                            </button>
                        </div>}
        </div>
    )
}

export default Search