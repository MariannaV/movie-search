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
        slidesPerView: 3,
        // centeredSlides: true,
        dynamicBullets: true,
        spaceBetween: 10,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
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
      if (!history.state) history.replaceState({ searchMovie: 'House', page: 1 }, 'movies');
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
          addSearchResults(`No results for ${searchMovie}`);
          this.slidesCreate();
          return;
        }
      }
      const searchMovieIds = [...getSearchResultsByCurrentSearchMovie()];

      const searchMovies = searchMovieIds.map((movieId) => API_OMDB.movies.get(movieId));
      console.log(searchMovies);
      addSearchResults(`Results for ${searchMovie}`);
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
                   <p>${moviesData.Title}</p>
                   </a>
               </div>
               <div class='card-img'>
                    <img src=${moviesData.Poster !== 'N/A' ? moviesData.Poster : '/assets/no-available-photo.svg'}>
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
