export class JsonPixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #key = '30342028-2b0f208511d1ff42beafaf97c';
  #page = 1;
  #per_page = 20;

  getImage() {
    const url = `${this.#BASE_URL}?key=${this.#key}&page=${
      this.#page
    }&per_page=${this.#per_page}`;

    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error('error');
      }
      return response.json();
    });
  }
}

// &q=yellow+flowers&image_type=photo&orientation=horizontal&safesearch=true
