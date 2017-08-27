document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.querySelector('#submit-button');
  const newPostForm = document.querySelector('.new-post form');
  const title = document.querySelector('#new-post-title');
  const content = document.querySelector('#new-post-content');
  const helpButton = document.querySelector('#formatting-help-button');
  const help = document.querySelector('#formatting-help');
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

  // Handle formatting help button.
  let helpCounter = 0;
  helpButton.addEventListener('click', event => {
    helpCounter++;
    const showHelp = helpCounter % 2 == 1;
    helpButton.textContent = showHelp ? 'Hide Help' : 'Formatting Help';
    if (showHelp) {
      help.style.display = 'block';
    } else {
      help.style.display = 'none';
    }
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
        // Clear form.
        newPostForm.reset();
        content.style.height = '100px';
        title.focus().blur(); // Safari 10.0 bug.
      }).catch(err => {
        console.log(err);
      }).then(() => {
        // Always reset submit button.
        submitButton.textContent = 'Submit';
        submitButton.style.width = '';
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
    this.title = data.title;
    this.content = data.content;
    this.mdContent = data.md_content;
    this.created_at = data.created_at;
    this.created_by = data.created_by;
    this.author_name = data.author_name;
  }

  displayPost() {
    const newsItem = document.createElement('article');
    newsItem.classList.add('news-item');

    const author = document.createElement('h3');
    author.classList.add('news-item-author');
    author.textContent = this.author_name || 'No Name'; // this.author may be null.

    const title = document.createElement('h3');
    title.classList.add('news-item-title');
    title.textContent = this.title;

    const date = document.createElement('time');
    const createdAt = new Date(this.created_at);
    date.setAttribute('title', createdAt.toUTCString());
    date.setAttribute('datetime', createdAt.toISOString());
    date.textContent = this.date;

    const dateContainer = document.createElement('h4');
    dateContainer.classList.add('news-item-date');
    dateContainer.appendChild(date);

    const contentContainer = document.createElement('div');
    contentContainer.classList.add('news-item-content');

    if (this.mdContent) {
      contentContainer.innerHTML = this.mdContent;
    } else {
      const content = document.createElement('p');
      content.textContent = this.content;
      contentContainer.appendChild(content);
    }

    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('news-item-actions');

    const actionsUl = document.createElement('ul');
    const likeLi = document.createElement('li');
    const editLi = document.createElement('li');
    const deleteLi = document.createElement('li');
    const replyLi = document.createElement('li');
    const likeA = document.createElement('a');
    likeA.classList.add('action-like');
    likeA.href= 'javascript: void 0;';
    likeA.setAttribute('title', 'Like');
    const likeButton = document.createElement('i');
    likeButton.classList.add('fa');
    likeButton.classList.add('fa-heart-o');
    likeButton.setAttribute('aria-hidden', 'true');
    likeA.appendChild(likeButton);
    const likeText = document.createTextNode('Like');
    likeA.appendChild(likeText);

    const editA = document.createElement('a');
    editA.classList.add('action-edit');
    editA.href = 'javascript: void 0;';
    editA.setAttribute('title', 'Edit');
    const editButton = document.createElement('i');
    editButton.classList.add('fa');
    editButton.classList.add('fa-pencil');
    editButton.setAttribute('aria-hidden', 'true');
    editA.appendChild(editButton);
    const editText = document.createTextNode('Edit');
    editA.appendChild(editText);

    const deleteA = document.createElement('a');
    deleteA.classList.add('action-delete');
    deleteA.href = 'javascript: void 0;';
    deleteA.setAttribute('title', 'Delete');
    const deleteButton = document.createElement('i');
    deleteButton.classList.add('fa');
    deleteButton.classList.add('fa-trash');
    deleteButton.setAttribute('aria-hidden', 'true');
    deleteA.appendChild(deleteButton);
    const deleteText = document.createTextNode('Delete');
    deleteA.appendChild(deleteText);

    const replyA = document.createElement('a');
    replyA.classList.add('action-reply');
    replyA.href = 'javascript: void 0;';
    replyA.setAttribute('title', 'Reply');
    const replyButton = document.createElement('i');
    replyButton.classList.add('fa');
    replyButton.classList.add('fa-reply');
    replyButton.setAttribute('aria-hidden', 'true');
    replyA.appendChild(replyButton);
    const replyText = document.createTextNode('Reply');
    replyA.appendChild(replyText);

    likeLi.appendChild(likeA);
    editLi.appendChild(editA);
    deleteLi.appendChild(deleteA);
    replyLi.appendChild(replyA);

    actionsUl.appendChild(likeLi);
    actionsUl.appendChild(editLi);
    actionsUl.appendChild(deleteLi);
    actionsUl.appendChild(replyLi);

    actionsContainer.appendChild(actionsUl);

    newsItem.appendChild(author);
    newsItem.appendChild(title);
    newsItem.appendChild(dateContainer);
    newsItem.appendChild(contentContainer);
    newsItem.appendChild(actionsContainer);

    const latestNews = document.querySelector('.latest-news');
    latestNews.appendChild(newsItem);

    // Event handlers for each post.
    likeA.addEventListener('click', event => {
      likeButton.classList.remove('fa-heart-o');
      likeButton.classList.add('fa-heart');
      likeText.textContent = 'Liked';
      likeA.classList.add('action-like-liked');
    });
  }

  static getNews() {
    return fetch('/api/news', {
      credentials: 'include'
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(posts => {
      console.log(posts);
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
      credentials: 'include',
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
        alert('Could not post. Please try again. Error:', data.message);
        throw new Error(data.message);
      }
    }).catch(err => {
      console.log(err);
    });
  }
}
