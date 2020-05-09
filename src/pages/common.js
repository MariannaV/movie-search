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
  const deleteButton = searchForm.querySelector('.delete-button');
  const searchInput = searchForm.querySelector('.search-input');

  searchForm.addEventListener('submit', (button) => {
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
export function addSearchResults(message) {
  const resultsBlock = document.querySelector('.results');
  resultsBlock.innerHTML = '';
  if (message) resultsBlock.insertAdjacentHTML('afterbegin', `${message}`);
}

export function showErrorMessage(message) {
  const errorMessageContainer = document.querySelector('.errors-block');
  const errorBlock = errorMessageContainer.querySelector('.popup-text');
  const closePopup = errorMessageContainer.querySelector('.close-popup');
  function onKeyDownClose(event) {
    if (event.keyCode === 27) {
      errorMessageContainer.classList.remove('active');
      closePopup.removeEventListener('click', onClosePopup);
      document.body.removeEventListener('keydown', onKeyDownClose);
    }
  }
  function onClosePopup() {
    errorMessageContainer.classList.remove('active');
    closePopup.removeEventListener('click', onClosePopup);
    document.body.removeEventListener('keydown', onKeyDownClose);
  }
  document.body.addEventListener('keydown', onKeyDownClose);
  closePopup.addEventListener('click', onClosePopup);
  errorMessageContainer.classList.add('active');
  errorBlock.innerHTML = '';
  errorBlock.insertAdjacentHTML('afterbegin', message);
}
