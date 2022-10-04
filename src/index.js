import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { JsonPixabayAPI } from './js/JsonPixabayAPI.js';
import { createImageCards } from './js/createImageCards.js';
import { searchImg } from './js/requestPixabayApi';

const jsonPixabayAPI = new JsonPixabayAPI();

const refs = {
  div: document.querySelector('.gallery'),
  form: document.querySelector('#search-form'),
};

refs.form.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  const searchInput = e.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase();
  searchImg(searchInput);
  if (!searchInput) {
    Notify.info('The field cannot be empty!');
    return;
  }

  createImageCards(searchInput)
    .then(image => {
      console.log(image);
    })
    .catch(error => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          position: 'center-top',
        }
      );
      return error;
    });
}

// jsonPixabayAPI.getImage().then(data => {
//   const markup = createImageCards(data);
//   console.log(markup);
// });
