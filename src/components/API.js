export const API_OMDB = {
  get apikey() {
    return '50c65d0c'; //process.env.OMDB_key
  },
  searchResults: new Map([]),
  movies: new Map([]),
  moviesRaiting: new Map([]),
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
      if (!this.searchResults.has(text)) {
        this.searchResults.set(text, new Set());
      }

      movieIds.forEach((movieId) => {
        this.searchResults.get(text).add(movieId);
      });

      if ('Error' in result) throw Error(result.Error);
      console.log(
        'result:',
        result,
        'text:',
        text,
        'page:',
        page,
        'pageSize:',
        pageSize,
        'totalResults:',
        result.totalResults,
        'result.Search:',
        result.Search
      );
      // console.log('!!!', this.searchResults.get(text).add('123'));
      console.log('movies:', this.movies, 'searchResults', this.searchResults);
    } catch (error) {
      console.log(error);
    }
  },
  async moviesRaitingGetById(params = {}){
    const { movieId } = params;
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${this.apikey}`);
      if (!response.ok) throw Error('NO OK');
      const result = await response.json();
      console.log(result.imdbRating);
      if ('Error' in result) throw Error(result.Error);
      // return result;
      this.moviesRaiting.set(movieId, result.imdbRating);
      console.log(this.moviesRaiting)
    }
    catch (error) {
      console.log(error);
    }
  }
};



window.onload = async () => {
  await API_OMDB.moviesGetBySearch({ text: 'House', page: 1 /*year: -2*/ });
  console.log(slidesCreate());
  console.log(API_OMDB.moviesRaitingGetById({movieId: 'tt0180093'}))
};


// API_OMDB.moviesGetBySearch({ text: 'House', page: 2 /*year: -2*/ });

function slidesCreate() {
  // fragment = document.createDocumentFragment();
  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('glide', 'movies-slider');
  API_OMDB.movies.forEach(function (slideData) {
    slidesContainer.appendChild(slideCreate(slideData));
  });
  return slidesContainer;
}

function slideCreate(moviesData, moviesRaitingData) {
  const slide = document.createElement('div');
  slide.classList.add('glide__slide', 'card-item');
  slide.insertAdjacentHTML(
    'beforeend',
    `
               <div class='card-title'>
                   <p>${moviesData.Title}</p>
               </div>
               <div class='card-img'>
                    <img src=${moviesData.Poster}>
                </div>
               <div class='card-bottom'>
                    <div class='year'>${moviesData.Year}</div>
                    <div class='raiting'>${moviesRaitingData}</div>
                </div>
         `
  );
  return slide;
}
