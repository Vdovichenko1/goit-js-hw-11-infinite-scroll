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

//переменные
const refs = getRefs();

// события
refs.form.addEventListener('submit', handleSubmit);
refs.loadBtn.addEventListener('click', handleClick);

// библиотека галереи
const simple = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

// функция для формы
function handleSubmit(e) {
  e.preventDefault();
  refs.loadBtn.classList.add('is-hidden');
  // значение введеное пользователем
  searchInput = e.currentTarget.elements.searchQuery.value.trim().toLowerCase();
  refs.div.innerHTML = '';
  resetPage();
  // если ничего не введено
  if (searchInput.length === 0) {
    Notify.info('The field cannot be empty!');
    return;
  }
  // с помощью аксиос выгружаем с бекенда данные
  requestPixabayApi(searchInput)
    .then(({ data: { hits, totalHits } }) => {
      // если по запросу ничего не найдено
      if (totalHits === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            position: 'left-top',
          }
        );
      } else {
        // если найдено выдаем число найденных изоб
        Notify.success(`Hooray! We found ${totalHits} images.`);
        refs.loadBtn.classList.add('is-hidden');
      }
      refs.div.innerHTML = '';
      refs.div.insertAdjacentHTML('beforeend', createImageCards(hits));
      simple.refresh();
      refs.loadBtn.classList.remove('is-hidden');
      const total = calculateTotalPage(hits.length);
      if (total >= totalHits) {
        // если изоб больше чем найдено забираем кнопку загр еще и выдаем
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

// функция для кнопки Загрузить еще
async function handleClick() {
  const {
    data: { hits, totalHits },
  } = await requestPixabayApi(searchInput);

  try {
    refs.div.insertAdjacentHTML('beforeend', createImageCards(hits));
    const total = calculateTotalPage(hits.length) - totalHits;
    if (total < 40) {
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

// window.addEventListener('scroll', () => {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
// });
