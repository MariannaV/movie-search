export const API_OMDB = {
  get apikey() {
    return '50c65d0c'; //process.env.OMDB_key
  },
  searchResults: new Map([]),
  movies: new Map([]),
  //TODO: get search url params api mdn
  async moviesGetBySearch(params = {}) {
    const { text, year, page } = params;
    const pageSize = 10;
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
      this.searchResults.set(text, movieIds);
      if ('Error' in result) throw Error(result.Error);
      console.log(result, text, page, pageSize, result.totalResults, result.Search);

      console.log(this.movies, this.searchResults);
    } catch (error) {
      console.log(error);
    }
  },
};

API_OMDB.moviesGetBySearch({ text: 'House', page: 1 /*year: -2*/ });
