import { useCallback, useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import { MultiDropdown, SingleDropdown } from '@bctc/components';

const SORT_OPTIONS = [
  {
    id: 'popularity.desc',
    title: 'Popularity Descending',
  },
  {
    id: 'popularity.asc',
    title: 'Popularity Ascending',
  },
  {
    id: 'revenue.desc',
    title: 'Revenue Descending',
  },
  {
    id: 'revenue.asc',
    title: 'Revenue Ascending',
  },
];

const API_READ_ACCESS_TOKEN = import.meta.env.VITE_API_READ_ACCESS_TOKEN;


export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path?: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface Genre {
  id: number;
  name: string;
}

function LandingPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total_pages: 1,
    total_results: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState('popularity.desc');

  const searchMovies = useCallback(async () => {
    const data = await fetch(
      'https://api.themoviedb.org/3/search/movie?' +
        new URLSearchParams({
          page: pagination.page.toString(),
          query: searchQuery,
        }),
      {
        headers: {
          Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`,
        },
      },
    ).then((res) => res.json());
    setMovies(data.results);
    setPagination({
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
    });
  }, [pagination.page, searchQuery]);

  const discoverMovies = useCallback(async () => {
    const data = await fetch(
      'https://api.themoviedb.org/3/discover/movie?' +
        new URLSearchParams({
          page: pagination.page.toString(),
          with_genres: selectedGenres.join(','),
          sort_by: sortBy,
        }),
      {
        headers: {
          Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`,
        },
      },
    ).then((res) => res.json());

    setMovies(data.results);
    setPagination({
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
    });
  }, [sortBy, pagination.page, selectedGenres]);

  const handleChangePage = useCallback(
    (page: number) => {
      setPagination({
        ...pagination,
        page,
      });
    },
    [pagination],
  );

  const handleFetchGenres = useCallback(async () => {
    const data = await fetch('https://api.themoviedb.org/3/genre/movie/list', {
      headers: {
        Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`,
      },
    }).then((res) => res.json());

    setGenres(data.genres);
  }, []);

  useEffect(() => {
    handleFetchGenres();
  }, [handleFetchGenres]);

  useEffect(() => {
    // if there's a search query, search for movies, otherwise fetch popular movies
    if (searchQuery) {
      searchMovies();
    } else {
      discoverMovies();
    }
  }, [pagination.page, searchMovies, discoverMovies, searchQuery]);

  return (
    <>
      <div className='flex max-w-4xl py-4 mx-auto'>
        <div className='flex space-x-3'>
          <div>
            <label
              htmlFor='searchQuery'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Search by title
            </label>
            <div className='mt-0.5'>
              <input
                type='text'
                name='searchQuery'
                id='searchQuery'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                placeholder='Avengers'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (searchQuery) {
                      searchMovies();
                    } else {
                      discoverMovies();
                    }
                  }
                }}
              />
            </div>
          </div>
          <div>
            <MultiDropdown
              label='Genres'
              data={genres.map((genre) => ({
                id: genre.id.toString(),
                title: genre.name,
              }))}
              onChange={setSelectedGenres}
              value={selectedGenres}
            />
          </div>
          <div>
            <SingleDropdown
              label='Sort By'
              data={SORT_OPTIONS}
              onChange={setSortBy}
              value={sortBy}
            />
          </div>
        </div>
      </div>
      <div className='grid max-w-4xl grid-cols-4 grid-rows-5 gap-2 mx-auto'>
        {movies.map((movie, index) => (
          <Link to={`/movie/${movie.id}`} key={index}>
            <img
              src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}
              alt={movie.title}
              className='w-full rounded-md shadow-md'
            />
            <p className='text-sm font-semibold'>
              {index + 1} {movie.title}
            </p>
          </Link>
        ))}
      </div>
      <div className='flex items-center justify-center mb-2'>
        <button
          disabled={pagination.page === 1}
          onClick={() => handleChangePage(pagination.page - 1)}
          className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'
        >
          Prev
        </button>
        <p className='mx-4 font-bold text-center'>
          Page {pagination.page} of {pagination.total_pages}
        </p>
        <button
          disabled={pagination.page === pagination.total_pages}
          onClick={() => handleChangePage(pagination.page + 1)}
          className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'
        >
          Next
        </button>
      </div>
    </>
  );
}

export default LandingPage;