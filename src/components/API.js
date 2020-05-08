import { showErrorMessage } from '../pages/common.js';

export const API_OMDB = {
  get apikey() {
    return '50c65d0c'; //process.env.OMDB_key
  },
  pageSize: 10,
  searchResults: new Map([]),
  movies: new Map([]),
  //TODO: get search url params api mdn
  async moviesGetBySearch(params = {}) {
    const { text, year, page } = params;
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${this.apikey}&s=${text}&page=${page}&y=${year}`);
      if (!response.ok) {
        throw Error('NO OK');
      }
      const result = await response.json();
      const movieIds = new Set();
      if (result.Response === 'False') return;
      result.Search.forEach((movie) => {
        this.movies.set(movie.imdbID, movie);
        movieIds.add(movie.imdbID);
      });
      await Promise.all(
        [...movieIds]
          .map((movieId) => [
            this.moviesRaitingGetById({ movieId }),
            fetch(this.movies.get(movieId).Poster).then((image) =>
              imageToBase64({
                image,
                onload: (PosterBase64) => {
                  this.movies.set(movieId, { ...this.movies.get(movieId), PosterBase64 });
                },
              })
            ),
          ])
          .flat()
      );

      if (!this.searchResults.has(text)) {
        this.searchResults.set(text, new Set());
      }
      movieIds.forEach((movieId) => {
        this.searchResults.get(text).add(movieId);
      });

      if ('Error' in result) {
        throw Error(result.Error);
      }
    } catch (error) {
      showErrorMessage(error);
    }
  },
  async moviesRaitingGetById(params = {}) {
    const { movieId } = params;
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${this.apikey}`);
      if (!response.ok) {
        throw Error('NO OK');
      }
      const result = await response.json();
      if ('Error' in result) {
        throw Error(result.Error);
      }
      this.movies.set(movieId, { ...this.movies.get(movieId), imdbRaiting: result.imdbRating });
    } catch (error) {
      showErrorMessage(error);
    }
  },
};

export const API_TRANSLATE = {
  get apikey() {
    return 'trnsl.1.1.20200429T181625Z.70c449acda86ca78.acb0fcbb0be0df748458456d59c0c6e4e08624e4';
  },
  async translateTo(param = {}) {
    document.querySelector('.loader-wrapper').classList.add('loading');
    const { word, lang } = param;
    try {
      const response = await fetch(
        `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${this.apikey}&text=${word}&lang=${lang}`
      );
      if (!response.ok) throw Error('NO OK');
      const result = await response.json();
      // because we always get array with one value as answer for our text

      return result.text[0];
    } catch (error) {
      showErrorMessage(error);
      return word;
    }
  },
};

async function imageToBase64({ image, onload }) {
  const blob = await image.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function () {
      onload(this.result);
      resolve();
    };
    reader.readAsDataURL(blob);
  });
}
