import Swiper from '/libs/swiper/js/swiper.esm.browser.bundle.js';
import { API_OMDB, API_TRANSLATE } from './API.js';
import { addSearchResults } from '../pages/common.js';

export const movieSlider = sliderCreate({ sliderName: 'movieSlider' });

function sliderCreate({ sliderName }) {
  const sliderId = Symbol(sliderName);
  return {
    init() {
      this[sliderId] = new Swiper(`#${sliderName}`, {
        speed: 400,
        updateOnWindowResize: true,
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          550: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          900: {
            slidesPerView: 3,
          },
          1250: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
        },

        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        on: {
          reachEnd: () => {
            if (history.state) history.state.page++;
            this.slidesCreate();
          },
        },
      });
    },
    recreate() {
      this[sliderId].virtual.removeAllSlides();
    },
    get slider() {
      if (!this[sliderId]) this.init();
      return this[sliderId];
    },
    async slidesCreate() {
      const { isNotFound, searchMovie: notFoundedMovie } = history.state ?? {};
      if (!history.state || history.state.isNotFound) history.replaceState({ searchMovie: 'House', page: 1 }, 'movies');

      const { page } = history.state;
      const searchMovie = await API_TRANSLATE.translateTo({ word: history.state.searchMovie, lang: 'en' });
      const getSearchResultsByCurrentSearchMovie = () => API_OMDB.searchResults.get(searchMovie);
      if (
        !getSearchResultsByCurrentSearchMovie() ||
        getSearchResultsByCurrentSearchMovie().size <= (page - 1) * API_OMDB.pageSize
      ) {
        await API_OMDB.moviesGetBySearch({
          text: searchMovie,
          page,
        });
        if (!getSearchResultsByCurrentSearchMovie()) {
          history.replaceState(
            {
              ...history.state,
              isNotFound: true,
            },
            'movies'
          );
          this.slidesCreate();
          return;
        }
      }

      const isTranslated = history.state.searchMovie !== searchMovie;
      addSearchResults(
        (() => {
          if (isNotFound) return `No results for "${notFoundedMovie}"`;
          if (isTranslated) return `Showing results for "${searchMovie}"`;
          return null;
        })()
      );

      const searchMovieIds = [...getSearchResultsByCurrentSearchMovie()];
      const searchMovies = searchMovieIds.map((movieId) => API_OMDB.movies.get(movieId));
      document.querySelector('.loader-wrapper').classList.remove('loading');

      this.slider.appendSlide(
        searchMovies.slice((history.state.page - 1) * API_OMDB.pageSize).map((movieData) => this.slideCreate(movieData))
      );
    },
    slideCreate(moviesData) {
      const slide = document.createElement('div');
      slide.classList.add('swiper-slide', 'card-item');
      slide.insertAdjacentHTML(
        'beforeend',
        `
               <div class='card-title'>
                  <a target="_blank" href="https://www.imdb.com/title/${moviesData.imdbID}/">
                     ${moviesData.Title}
                  </a>
               </div>
               <div class='card-img'>
                    <img src=${
                      moviesData.Poster !== 'N/A'
                        ? moviesData.PosterBase64
                        : '/assets/img/content/no-available-photo.svg'
                    }>
                </div>
               <div class='card-bottom'>
                    <div class='year'>${moviesData.Year}</div>
                    ${moviesData.imdbRaiting !== 'N/A' ? `<div class='raiting'>${moviesData.imdbRaiting}</div>` : ''}
                </div>
                
         `
      );
      return slide;
    },
  };
}
