export const API_OMDB = {
  get apikey() {
    return '50c65d0c'; //process.env.OMDB_key
  },
  pageSize: 10,
  searchResults: new Map([]),
  movies: new Map([]),
  moviesRaiting: new Map([]),
  //TODO: get search url params api mdn
  async moviesGetBySearch(params = {}) {
    const { text, year, page } = params;
    //check all required params
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${this.apikey}&s=${text}&page=${page}&y=${year}`);
      if (!response.ok) throw Error('NO OK');
      const result = await response.json();
      const movieIds = new Set();
      result.Search.forEach((movie) => {
        this.movies.set(movie.imdbID, movie);
        movieIds.add(movie.imdbID);
      });
      if (!this.searchResults.has(text)) {
        this.searchResults.set(text, new Set());
      }
      movieIds.forEach((movieId) => {
        this.searchResults.get(text).add(movieId);
      });
      if ('Error' in result) throw Error(result.Error);
    } catch (error) {
      window.alert(error);
    }
  },
  async moviesRaitingGetById(params = {}) {
    const { movieId } = params;
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${this.apikey}`);
      if (!response.ok) throw Error('NO OK');
      const result = await response.json();
      if ('Error' in result) throw Error(result.Error);
      this.moviesRaiting.set(movieId, result.imdbRating);
    } catch (error) {
      window.alert(error);
    }
  },
};
