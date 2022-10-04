import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// import { JsonPixabayAPI } from './js/JsonPixabayAPI';
import { createImageCards } from './js/createImageCards.js';
import {
  requestPixabayApi,
  incrementPage,
  calculateTotalPage,
} from './js/requestPixabayApi';

// const jsonPixabayAPI = new JsonPixabayAPI();

let searchInput = '';

const refs = {
  div: document.querySelector('.gallery'),
  form: document.querySelector('#search-form'),
  loadBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', handleSubmit);
refs.loadBtn.addEventListener('click', handleClick);

function handleSubmit(e) {
  e.preventDefault();
  searchInput = e.currentTarget.elements.searchQuery.value.trim().toLowerCase();
  if (searchInput.length === 0) {
    Notify.info('The field cannot be empty!');
    return;
  }
  page = 1;
  totalPage = 0;
  requestPixabayApi(searchInput)
    .then(({ data: { hits, totalHits } }) => {
      if (totalHits === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            position: 'center-top',
          }
        );
      } else {
        Notify.success(`Found ${totalHits}`, {
          position: 'center-top',
        });
      }
      refs.div.insertAdjacentHTML('beforeend', createImageCards(hits));
      refs.loadBtn.classList.remove('is-hidden');
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
  refs.div.innerHTML = '';
}

async function handleClick(e) {
  const {
    data: { hits, totalHits },
  } = await requestPixabayApi(searchInput);

  try {
    refs.div.insertAdjacentHTML('beforeend', createImageCards(hits));
    const total = calculateTotalPage(hits.length);
    if (total > totalHits) {
      refs.loadBtn.classList.add('is-hidden');
      Notify.info('!!!!');
    }
  } catch (error) {
    console.log(error);
    refs.div.innerHTML = '';
    refs.loadBtn.classList.add('is-hidden');
  }
}
