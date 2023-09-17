import { useCallback, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import {Movie} from "../landing"

export const DetailPage = () => {
    const location = useLocation()
    const id = location.pathname.split('/')[2]
    const [movie, setMovie] = useState<Movie |null>(null)
    const API_READ_ACCESS_TOKEN = import.meta.env.VITE_API_READ_ACCESS_TOKEN;
    const fetchMovie = useCallback(async () => {
        const data = await fetch('https://api.themoviedb.org/3/movie/' + id,
        {
            headers: {
              Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`,
            }
        })
        const movieData = await data.json()
        setMovie(movieData)
    }, [id])
    useEffect(() => {
        fetchMovie()
    }, [fetchMovie])
    console.log(movie)
    return (
        movie ? 
        <div>
            <div>
            <img src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`} alt="" />
            </div>
            <div>
                <h1>{movie.original_title}</h1>
                <h2>{movie.overview}</h2>
            </div>
            
        </div> : null

    )
}