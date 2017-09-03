let newSort = null;
document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.querySelector('#submit-button');
  const newPost = document.querySelector('.new-post');
  const newPostForm = document.querySelector('.new-post form');
  const newPostButton = document.querySelector('#new-post-button');
  const closeNewPostButton = document.querySelector('#close-new-post-button');
  const sort = document.querySelector('#posts-sort');
  const title = document.querySelector('#new-post-title');
  const content = document.querySelector('#new-post-content');
  const helpButton = document.querySelector('#formatting-help-button');
  const help = document.querySelector('#formatting-help');
  const loginError = document.querySelector('.error-list');

  newSort = sort.value;

  // Load news.
  Post.get(newSort);

  // New post button handler.
  let newPostShown = false;
  newPostButton.addEventListener('click', event => {
    newPostShown = !newPostShown;
    newPost.style.display = newPostShown ? 'block' : 'none';
    newPostButton.style.display = newPostShown ? 'none': 'block';
  });

  closeNewPostButton.addEventListener('click', event => {
    newPostShown = !newPostShown;
    newPost.style.display = newPostShown ? 'block' : 'none';
    newPostButton.style.display = newPostShown ? 'none': 'block';
  });

  // Handle height of Content textbox.
  content.addEventListener('input', autoResizeTextbox);

  // Handle sort change.
  sort.addEventListener('change', event => {
    newSort = sort.value;
    Post.get(newSort);
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

    clearError(loginError);
    content.style.marginBottom = '10px'; // Restore normal margin.

    let invalid = false;
    if (!title.checkValidity()) {
      showError(loginError, title, getErrorMsg('title', title.validity));
      invalid = true;
    }

    if (!content.checkValidity()) {
      showError(loginError, content, getErrorMsg('content', content.validity));
      invalid = true;
    }

    if (invalid) {
      event.preventDefault();
      content.style.marginBottom = '0'; // Make it look less jumpy.
    } else {
      submitButton.textContent = 'Submitting...';
      submitButton.style.width = 'auto';
      submitButton.disabled = true;

      Post.post({
        title: title.value,
        content: content.value
      }).then(() => {
        // Clear form.
        newPostForm.reset();
        content.style.height = '40px';
        title.focus();
        title.blur(); // Safari 10.0 bug.
      }).catch(err => {
        console.log(err);
        alert('Could not post. Error:', err.message);
      }).then(() => {
        // Always reset submit button.
        submitButton.textContent = 'Submit';
        submitButton.style.width = '';
        submitButton.disabled = false;
      });
    }
  });
});

// Useful methods to deal with Posts.
class Post {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.mdContent = data.md_content;
    this.likes = data.like_count;
    this.user_liked = data.user_liked;
    this.created_at = data.created_at;
    this.created_at_relative = data.created_at_relative;
    this.created_by = data.created_by;
    this.author_name = data.author_name;
    this.pinned = data.pinned;
    this.user_is_author = data.user_is_author;
  }

  // Render each post.
  display(userLevel) {
    const newsItem = document.createElement('article');
    newsItem.classList.add('news-item');
    if (this.pinned) {
      newsItem.classList.add('news-item-pinned');
    }

    const topBar = document.createElement('div');
    topBar.classList.add('news-item-top-bar');

    const author = document.createElement('h3');
    author.classList.add('news-item-author');
    author.textContent = this.author_name || 'No Name'; // this.author may be null.

    const title = document.createElement('h3');
    title.classList.add('news-item-title');
    if (this.pinned) {
      const pin = document.createElement('i');
      pin.classList.add('fa');
      pin.classList.add('fa-thumb-tack');
      title.appendChild(pin);
      const titleText = document.createTextNode(this.title);
      title.appendChild(titleText);
    } else {
      title.textContent = this.title;
    }

    topBar.appendChild(author);
    topBar.appendChild(title);

    const likes = document.createElement('div');
    likes.classList.add('news-item-likes');
    likes.textContent = this.likes + (this.likes == 1 ? ' like' : ' likes');

    const date = document.createElement('time');
    date.classList.add('news-item-date');
    const createdAt = new Date(this.created_at);
    date.setAttribute('title', createdAt.toUTCString());
    date.setAttribute('datetime', createdAt.toISOString());
    date.textContent = this.created_at_relative;

    const dateAndLikesContainer = document.createElement('h4');
    dateAndLikesContainer.classList.add('news-item-date-and-likes');
    dateAndLikesContainer.appendChild(likes);
    dateAndLikesContainer.appendChild(date);

    const contentContainer = document.createElement('div');
    contentContainer.classList.add('news-item-content');

    // Default to displaying regular content if no markdown version exists.
    if (this.mdContent) {
      contentContainer.innerHTML = this.mdContent;
    } else {
      const content = document.createElement('p');
      content.textContent = this.content;
      contentContainer.appendChild(content);
    }

    const errorList = document.createElement('ul');
    errorList.classList.add('error-list');

    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('news-item-actions');

    const actionsUl = document.createElement('ul');
    const likeLi = document.createElement('li');
    const saveLi = document.createElement('li');
    saveLi.style.display = 'none';
    const editLi = document.createElement('li');
    const deleteLi = document.createElement('li');
    const pinLi = document.createElement('li');
    pinLi.style.display = this.pinned ? 'none' : 'inline-block';
    const unpinLi = document.createElement('li');
    unpinLi.style.display = this.pinned ? 'inline-block' : 'none';

    // Like button.
    const likeA = document.createElement('a');
    likeA.classList.add('action-like');
    likeA.href = 'javascript: void 0;';
    likeA.setAttribute('title', 'Like');
    const likeButton = document.createElement('i');
    const likeText = document.createTextNode('Like');
    if (this.user_liked) {
      likeButton.classList.add('fa-heart');
      likeText.textContent = 'Liked';
      likeA.classList.add('action-like-liked');
    } else {
      likeButton.classList.add('fa-heart-o');
      likeText.textContent = 'Like';
      likeA.classList.remove('action-like-liked');
    }
    likeButton.classList.add('fa');
    likeButton.setAttribute('aria-hidden', 'true');
    likeA.appendChild(likeButton);
    likeA.appendChild(likeText);

    // Save button.
    const saveA = document.createElement('a');
    saveA.classList.add('action-save');
    saveA.href = 'javascript: void 0;';
    saveA.setAttribute('title', 'Save');
    const saveButton = document.createElement('i');
    saveButton.classList.add('fa');
    saveButton.classList.add('fa-save');
    saveButton.setAttribute('aria-hidden', 'true');
    saveA.appendChild(saveButton);
    const saveText = document.createTextNode('Save');
    saveA.appendChild(saveText);

    // Edit button.
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

    // Delete button.
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

    // Pin button.
    const pinA = document.createElement('a');
    pinA.classList.add('action-pin');
    pinA.href = 'javascript: void 0;';
    pinA.setAttribute('title', 'Pin');
    const pinButton = document.createElement('i');
    pinButton.classList.add('fa');
    pinButton.classList.add('fa-thumb-tack');
    pinButton.setAttribute('aria-hidden', 'true');
    pinA.appendChild(pinButton);
    const pinText = document.createTextNode('Pin');
    pinA.appendChild(pinText);

    // Unpin button.
    const unpinA = document.createElement('a');
    unpinA.classList.add('action-unpin');
    unpinA.href = 'javascript: void 0;';
    unpinA.setAttribute('title', 'Unpin');
    const unpinButton = document.createElement('i');
    unpinButton.classList.add('fa');
    unpinButton.classList.add('fa-thumb-tack');
    unpinButton.setAttribute('aria-hidden', 'true');
    unpinA.appendChild(unpinButton);
    const unpinText = document.createTextNode('Unpin');
    unpinA.appendChild(unpinText);

    likeLi.appendChild(likeA);
    saveLi.appendChild(saveA);
    editLi.appendChild(editA);
    deleteLi.appendChild(deleteA);
    pinLi.appendChild(pinA);
    unpinLi.appendChild(unpinA);


    actionsUl.appendChild(likeLi);
    // Make sure user owns the post.
    if (this.user_is_author) {
      actionsUl.appendChild(saveLi);
      actionsUl.appendChild(editLi);
    }

    if (userLevel === 'admin' || this.user_is_author) {
      actionsUl.appendChild(deleteLi);
    }

    if (userLevel === 'admin') {
      actionsUl.appendChild(pinLi);
      actionsUl.appendChild(unpinLi);
    }

    actionsContainer.appendChild(actionsUl);

    newsItem.appendChild(topBar);
    newsItem.appendChild(dateAndLikesContainer);
    newsItem.appendChild(contentContainer);
    newsItem.appendChild(errorList);
    newsItem.appendChild(actionsContainer);

    const latestNews = document.querySelector('.latest-news');
    latestNews.appendChild(newsItem);

    // Event handlers for each post.
    likeA.addEventListener('click', event => {
      console.log(this.title);
      this.like().then(data => {
        if (data.success) {
          // Toggle like button.
          if (data.like_status === 'liked') {
            likeButton.classList.remove('fa-heart-o');
            likeButton.classList.add('fa-heart');
            likeText.textContent = 'Liked';
            likeA.classList.add('action-like-liked');
          } else { // 'unliked'
            likeButton.classList.remove('fa-heart');
            likeButton.classList.add('fa-heart-o');
            likeText.textContent = 'Like';
            likeA.classList.remove('action-like-liked');
          }
          // Update like count.
          this.likes = data.like_count;
          likes.textContent = this.likes + (this.likes == 1 ? ' like' : ' likes');
        } else {
          console.error(data.message);
          alert(data.message);
          location.reload();
        }
      });
    });

    let textarea = null;
    let input = null;
    editA.addEventListener('click', event => {
      editButton.classList.toggle('fa-pencil');
      editButton.classList.toggle('fa-close');

      if (textarea === null) { // Edit button pressed.
        textarea = document.createElement('textarea');
        textarea.classList.add('news-item-editing-content');
        textarea.addEventListener('input', autoResizeTextbox);
        input = document.createElement('input');
        input.classList.add('news-item-title');
        input.classList.add('news-item-editing-title');
        input.maxLength = 100;
        input.required = true;
        input.value = this.title;
        // title.contentEditable = true;
        input.classList.add('news-item-editing-title');
        editText.textContent = 'Cancel';
        textarea.value = this.content;
        contentContainer.parentNode.insertBefore(textarea, contentContainer);
        contentContainer.style.display = 'none';
        title.parentNode.insertBefore(input, title);
        title.style.display = 'none';
        author.style.display = 'none';

        // textarea.scrollHeight requires the element to have been inserted into
        // the DOM.
        textarea.style.height = (textarea.scrollHeight > 100 ? textarea.scrollHeight : 100) + 'px';
        saveLi.style.display = '';
        textarea.focus();
      } else { // Update content.
        // title.contentEditable = false;
        editText.textContent = 'Edit';
        textarea.remove();
        input.remove();
        title.textContent = this.title;

        // Display content.
        while (contentContainer.firstChild) {
          contentContainer.firstChild.remove();
        }

        if (this.mdContent) {
          contentContainer.innerHTML = this.mdContent;
        } else {
          const content = document.createElement('p');
          content.textContent = this.content;
          contentContainer.appendChild(content);
        }

        contentContainer.style.display = '';
        title.style.display = '';
        author.style.display = '';
        textarea = null;
        saveLi.style.display = 'none';
      }
    });

    saveA.addEventListener('click', event => {
      clearError(errorList);

      let invalid = false;
      if (!input.checkValidity()) {
        showError(errorList, input, getErrorMsg('title', input.validity));
        invalid = true;
      }

      if (!textarea.checkValidity()) {
        showError(errorList, textarea, getErrorMsg('content', textarea.validity));
        invalid = true;
      }

      if (invalid) {
        event.preventDefault();
        // content.style.marginBottom = '0'; // Make it look less jumpy.
      } else {
        saveText.textContent = 'Saving...';
        saveA.style.width = 'auto';
        // This should really be a button, but since it's not, emulate
        // .disabled = true
        let disableA = event => event.preventDefault();
        saveA.addEventListener('click', disableA);

        Post.put(this.id, {
          title: input.value,
          content: textarea.value
        }).then(data => {
          // Update data and render.
          this.title = input.value;
          this.content = textarea.value;
          this.mdContent = data.md_content;
          editA.click();
        }).catch(err => {
          console.error(err);
          alert('Could not save.');
        }).then(() => {
          // Always reset save button.
          saveText.textContent = 'Save';
          saveA.style.width = '';
          saveA.removeEventListener('click', disableA);
        });
      }
    });

    deleteA.addEventListener('click', event => {
      if (confirm('Are you sure?')) {
        Post.delete(this.id, newsItem);
      }
    });

    pinA.addEventListener('click', event => {
      this.pin();
    });

    unpinA.addEventListener('click', event => {
      this.unpin();
    });
  }

  like() {
    return fetch(`/api/news/like/${this.id}`, {
      credentials: 'include'
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    });
  }

  pin() {
    return fetch(`/api/news/pin/${this.id}`, {
      method: 'GET',
      credentials: 'include'
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(data => {
      if (data.success) {
        // Update news.
        return Post.get(newSort);
      } else {
        throw new Error(data.message);
      }
    });
  }

  unpin() {
    console.log(this.id);
    return fetch(`/api/news/unpin/${this.id}`, {
      method: 'GET',
      credentials: 'include'
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(data => {
      console.log(data);
      if (data.success) {
        // Update news.
        return Post.get(newSort);
      } else {
        throw new Error(data.message);
      }
    });
  }

  static get(sort) {
    return fetch(`/api/news?sort=${sort || ''}`, {
      credentials: 'include'
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(posts => {
      if (posts.success) {
        const userLevel = posts.data.user_level;
        posts = posts.data.data; // posts: array of data objects sorted new->old.

        // Clear all posts.
        const latestNews = document.querySelector('.latest-news');

        const latestNewsMessage = document.querySelector('.latest-news-message');
        if (latestNewsMessage) {
          latestNews.removeChild(latestNewsMessage);
        }

        let newsItem = document.querySelector('.latest-news .news-item');
        while (newsItem) {
          latestNews.removeChild(newsItem);
          newsItem = document.querySelector('.latest-news .news-item');
        }

        if (posts.length === 0) {
          const noPosts = document.createElement('p');
          noPosts.classList.add('latest-news-message');
          noPosts.textContent = 'No posts yet!';
          latestNews.appendChild(noPosts);
        }

        // Display each new post.
        for (const postData of posts) {
          const post = new Post(postData);
          post.display(userLevel);
        }
      } else {
        const latestNewsMessage = document.querySelector('.no-posts-message');
        latestNewsMessage.textContent = 'Could not get posts:', data.message;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  static post(data) {
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
        return Post.get(newSort);
      } else {
        throw new Error(data.message);
      }
    });
  }

  static put(id, data) {
    return fetch(`/api/news/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(data)
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    });
  }

  static delete(id, elementToRemove) {
    return fetch(`/api/news/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(data => {
      if (data.success) {
        elementToRemove.remove();
      } else {
        alert(data.message);
        // alert('You shouldn\'t have done that.');
        // location.href = '//youtube.com/watch?v=dQw4w9WgXcQ';
      }
    });
  }

}

function autoResizeTextbox(event) {
  // https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize/
  // No idea how this works, but it fixes a quirk of scrollHeight when deleting lines.
  event.target.style.height = 'auto';
  event.target.style.height = (event.target.scrollHeight > 100 ? event.target.scrollHeight : 100) + 'px';
}

// Form validation helpers.
function clearError(loginError) {
  while (loginError.firstChild) {
    loginError.removeChild(loginError.firstChild);
  }
}

function showError(loginError, element, text) {
  const item = document.createElement('li');
  item.textContent = text;
  loginError.appendChild(item);

  element.classList.add('invalid');
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
