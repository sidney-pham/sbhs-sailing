document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.querySelector('#submit-button');
  const newPostForm = document.querySelector('.new-post form');
  const title = document.querySelector('#new-post-title');
  const content = document.querySelector('#new-post-content');
  const loginError = document.querySelector('.error-list');

  // Load news.
  Post.getNews();

  // Handle height of Content textbox.
  content.addEventListener('input', event => {
    // https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize/
    // No idea how this works, but it fixes a quirk of scrollHeight when deleting lines.
    event.target.style.height = 'auto';
    event.target.style.height = (event.target.scrollHeight > 100 ? event.target.scrollHeight : 100) + 'px';
  });

  // Handle submit of new post.
  newPostForm.addEventListener('submit', event => {
    event.preventDefault();

    clearError();

    let invalid = false;
    if (!title.checkValidity()) {
      showError(title, getErrorMsg('title', title.validity));
      invalid = true;
    }

    if (!content.checkValidity()) {
      showError(content, getErrorMsg('content', content.validity));
      invalid = true;
    }

    if (invalid) {
      event.preventDefault();
      content.style.marginBottom = '0'; // Make it look less jumpy.
    } else {
      submitButton.textContent = 'Submitting...';
      submitButton.style.width = 'auto';

      Post.postNews({
        title: title.value,
        content: content.value
      }).then(() => {
        submitButton.textContent = 'Submit';
        submitButton.style.width = '';

        // Clear form.
        newPostForm.reset();
        title.focus().blur(); // Safari 10.0 bug.
      });
    }
  });

  // Form validation helpers.
  // These functions are in the event handler because they use elements from the DOM.
  function showError(element, text) {
    const item = document.createElement('li');
    item.textContent = text;
    loginError.appendChild(item);

    element.classList.add('invalid');
  }

  function clearError() {
    content.style.marginBottom = '10px'; // Restore normal margin.
    while (loginError.firstChild) {
      loginError.removeChild(loginError.firstChild);
    }
  }

  function getErrorMsg(name, validity) {
    let message;
    switch (true) {
      case validity.valueMissing:
        message = `${name} cannot be empty.`;
        break;
      case validity.tooLong:
        message = `${name} too long.`;
        break;
      case validity.rangeOverflow:
        message = `${name} too big.`;
        break;
      case validity.rangeUnderflow:
        message = `${name} too small.`;
        break;
      default:
        message = `Invalid ${name}.`;

      return message;
    }

    return sentenceCase(message);
  }

  function sentenceCase(text) {
    return text[0].toUpperCase() + (text.slice(1)).toLowerCase();
  }
});

class Post {
  constructor(data) {
    this.author = data.author;
    this.title = data.title;
    this.date = data.creation_time;
    this.fullDate = data.creation_timestamp;
    this.content = data.content;
  }

  displayPost() {
    const newsItem = document.createElement('article');
    newsItem.classList.add('news-item');

    const author = document.createElement('h3');
    author.classList.add('news-item-author');
    author.textContent = this.author || 'No Name'; // this.author may be null.

    const title = document.createElement('h3');
    title.classList.add('news-item-title');
    title.textContent = this.title;

    const date = document.createElement('time');
    const fullDate = new Date(this.fullDate);
    date.setAttribute('title', fullDate.toUTCString());
    date.setAttribute('datetime', fullDate.toISOString());
    date.textContent = this.date;

    const dateContainer = document.createElement('h4');
    dateContainer.classList.add('news-item-date');
    dateContainer.appendChild(date);

    const contentContainer = document.createElement('div');
    contentContainer.classList.add('news-item-content');

    const content = document.createElement('p');
    content.textContent = this.content;

    contentContainer.appendChild(content);

    newsItem.appendChild(author);
    newsItem.appendChild(title);
    newsItem.appendChild(dateContainer);
    newsItem.appendChild(contentContainer);

    const latestNews = document.querySelector('.latest-news');
    latestNews.appendChild(newsItem);
  }

  static getNews() {
    return fetch('/api/news').then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(posts => {
      // posts: array of data objects sorted new->old.
      // Clear all posts.
      const latestNews = document.querySelector('.latest-news');

      const noPostsMessage = document.querySelector('.no-posts-message');
      if (noPostsMessage) {
        latestNews.removeChild(noPostsMessage);
      }

      let newsItem = document.querySelector('.latest-news .news-item');
      while (newsItem) {
        latestNews.removeChild(newsItem);
        newsItem = document.querySelector('.latest-news .news-item');
      }

      if (posts.length === 0) {
        const noPosts = document.createElement('p');
        noPosts.classList.add('no-posts-message');
        noPosts.textContent = 'No posts yet!';
        latestNews.appendChild(noPosts);
      }

      // Display each new post.
      for (const postData of posts) {
        const post = new Post(postData);
        post.displayPost();
      }
    }).catch(err => {
      console.log(err);
    });
  }

  static postNews(data) {
    return fetch('/api/news', {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(data)
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(data => {
      console.log('success');
      if (data.success) {
        // Update news.
        return Post.getNews();
      } else {
        // Display post error. TODO
        alert('Fail:', data.message);
        throw new Error(data.message);
      }
    }).catch(data => {
      console.log(data);
    });
  }
}
