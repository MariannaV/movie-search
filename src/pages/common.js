import { movieSlider } from '../components/slider.js';

window.onload = async () => {
  listenSearchForm();
  movieSlider.init();
  if (history.state?.page) history.state.page = 1;
};

window.onpopstate = () => {
  movieSlider.recreate();
};

function listenSearchForm() {
  const searchForm = document.getElementById('searchMovie');
  const searchButton = searchForm.querySelector('.search-button');
  const deleteButton = searchForm.querySelector('.delete-button');
  const searchInput = searchForm.querySelector('.search-input');

  searchButton.addEventListener('click', (button) => {
    button.preventDefault();
    navigateTo({ searchMovie: searchInput.value.trim() });
  });

  deleteButton.addEventListener('click', () => {
    searchInput.value = null;
  });
}

function navigateTo({ searchMovie, page = 0 }) {
  history.pushState(searchMovie ? { searchMovie, page } : null, 'movies');
  movieSlider.recreate();
}
