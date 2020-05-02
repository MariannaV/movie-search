import Swiper from '/libs/swiper/js/swiper.esm.browser.bundle.js';
import { API_OMDB } from './API.js';

export const movieSlider = sliderCreate({ sliderName: 'movieSlider' });

function sliderCreate({ sliderName }) {
  const sliderId = Symbol(sliderName);
  return {
    init() {
      this[sliderId] = new Swiper(`#${sliderName}`, {
        speed: 400,
        slidesPerView: 4,
        centeredSlides: true,
        dynamicBullets: true,
        spaceBetween: 0,
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
      const { page, searchMovie } = history.state;
      const getSearchResultsByCurrentSearchMovie = () => API_OMDB.searchResults.get(searchMovie);

      if (
        !getSearchResultsByCurrentSearchMovie() ||
        getSearchResultsByCurrentSearchMovie().size <= (page - 1) * API_OMDB.pageSize
      ) {
        await API_OMDB.moviesGetBySearch({
          text: searchMovie,
          page,
        });
      }
      const searchMovieIds = [...getSearchResultsByCurrentSearchMovie()];
      const searchMovies = searchMovieIds.map((movieId) => API_OMDB.movies.get(movieId));

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
                   <p>${moviesData.Title}</p>
               </div>
               <div class='card-img'>
                    <img src=${moviesData.Poster}>
                </div>
               <div class='card-bottom'>
                    <div class='year'>${moviesData.Year}</div>
                    <div class='raiting'>${moviesData.moviesRaitingData}</div>
                </div>
         `
      );
      return slide;
    },
  };
}
