import axios from 'axios';

let page = 1;
let totalPages = 0;

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  key: '30342028-2b0f208511d1ff42beafaf97c',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
};

export async function requestPixabayApi(result) {
  const data = await axios.get('', {
    params: { q: result, page: page },
  });

  incrementPage();
  return data;
}

function incrementPage() {
  page += 1;
}

export function calculateTotalPage(newPage) {
  return (totalPages += newPage);
}

export function resetPage() {
  page = 1;
}

// Список параметрів рядка запиту, які тобі обов'язково необхідно вказати:

// key - твій унікальний ключ доступу до API.
// q - термін для пошуку. Те, що буде вводити користувач.
// image_type - тип зображення. На потрібні тільки фотографії, тому постав значення photo.
// orientation - орієнтація фотографії. Постав значення horizontal.
// safesearch - фільтр за віком. Постав значення true.
