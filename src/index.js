import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { JsonPixabayAPI } from './js/JsonPixabayAPI.js';
import { createImageCards } from './js/createImageCards.js';
import { requestPixabayApi } from './js/requestPixabayApi';

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
  if (searchInput.length === 0) {
    Notify.info('The field cannot be empty!');
    return;
  }
  requestPixabayApi(searchInput)
    .then(({ data: { hits, totalHits } }) => {
      if (hits.length === 0) {
        return console.log('ERROR');
      }
    })
    .catch(error => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          position: 'center-top',
        }
      );
    });
  refs.div.innerHTML = '';
  refs.div.insertAdjacentHTML('beforeend', createImageCards(hits));
}
