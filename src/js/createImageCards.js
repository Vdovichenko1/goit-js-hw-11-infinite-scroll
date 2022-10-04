export function createImageCards(img) {
  return img
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="photo-card" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b class='info-text'>Likes: </b> ${likes}
    </p>
    <p class="info-item">
      <b class='info-text'>Views: </b> ${views}
    </p>
    <p class="info-item">
      <b class='info-text'>Comments: </b> ${comments}
    </p>
    <p class="info-item">
      <b class='info-text'>Downloads: </b> ${downloads}
    </p>
  </div>
</a>`;
      }
    )
    .join('');
}

// У відповіді буде масив зображень, що задовольнили критерії параметрів запиту. Кожне зображення описується об'єктом, з якого тобі цікаві тільки наступні властивості:

// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
