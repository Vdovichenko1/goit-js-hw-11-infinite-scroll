import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';
import { createImageCards } from './js/createImageCards.js';
import {
  requestPixabayApi,
  calculateTotalPage,
  resetPage,
} from './js/requestPixabayApi';
import { getRefs } from './js/refs';

let searchInput = '';

const refs = getRefs();

refs.form.addEventListener('submit', handleSubmit);
refs.loadBtn.addEventListener('click', handleClick);

const simple = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

function handleSubmit(e) {
  e.preventDefault();
  refs.loadBtn.classList.add('is-hidden');
  searchInput = e.currentTarget.elements.searchQuery.value.trim().toLowerCase();
  refs.div.innerHTML = '';
  resetPage();
  if (searchInput.length === 0) {
    Notify.info('The field cannot be empty!');
    return;
  }
  requestPixabayApi(searchInput)
    .then(({ data: { hits, totalHits } }) => {
      if (totalHits === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            position: 'left-top',
          }
        );
      } else {
        Notify.success(`Hooray! We found ${totalHits} images.`);
        refs.loadBtn.classList.add('is-hidden');
      }
      refs.div.innerHTML = '';
      refs.div.insertAdjacentHTML('beforeend', createImageCards(hits));
      simple.refresh();
      refs.loadBtn.classList.remove('is-hidden');
      const total = calculateTotalPage(hits.length);
      if (total >= totalHits) {
        refs.loadBtn.classList.add('is-hidden');
        Notify.info(
          "We're sorry, but you've reached the end of search results.",
          {
            position: 'center-center',
          }
        );
      }
    })
    .catch(error => {
      console.log(error);
    });
  refs.div.innerHTML = '';
}

async function handleClick() {
  const {
    data: { hits, totalHits },
  } = await requestPixabayApi(searchInput);

  try {
    refs.div.insertAdjacentHTML('beforeend', createImageCards(hits));
    const total = calculateTotalPage(hits.length);
    if (total > totalHits) {
      refs.loadBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.log(error);
    refs.div.innerHTML = '';
  }
}

// let elem = document.querySelector('.container');
// let infScroll = new InfiniteScroll(elem, {
//   // options
//   path: '.pagination__next',
//   append: '.post',
//   history: false,
// });

// // element argument can be a selector string
// //   for an individual element
// let infScroll = new InfiniteScroll('.container', {
//   // options
// });

// window.addEventListener('scroll', onScroll);

// function onScroll(e) {
//   const documentRect = document.documentElement.getBoundingClientRect();
//   // console.log('top', documentRect.top);
//   // console.log('bottom', documentRect.bottom);
//   if (documentRect.bottom < document.documentElement.clientHeight + 150) {
//     incrementPage();
//     requestPixabayApi(e.currentTarget.elements.searchQuery.value);
//   }
// }
