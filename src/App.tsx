import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import { Movie } from "./lib/types";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const[debounceSearchTerm,setDebounceSearchTerm]=useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [moviesList, SetMoviesList] = useState<Movie[] | null>([]);

  useDebounce(()=>setDebounceSearchTerm(searchTerm),500,[searchTerm])

  const fetchMovies = async (query='') => {
    setIsLoading(true);
    try {
      const endPoint = query?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`:`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS);
      if (!response.ok) {
        console.log(response);
        throw new Error("failed to fetch movies");
      }
      const data = await response.json();
      if (data.Response === false) {
        setErrorMessage(data.Error || "failed to fetch movies");
        return;
      }
      SetMoviesList(data.results);
      console.log(data);
    
    } catch (error) {
      console.log(`error fetching movie:${error} `);
      setErrorMessage(`${error}`);
    } finally {
      setIsLoading(false)
    }
  };
  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="hero banner" />
          <h1>
            find <span className="text-gradient">movies</span> you will enjoy
            without the hassle{" "}
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {moviesList?.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>                
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
