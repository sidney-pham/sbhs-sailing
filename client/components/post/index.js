import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import queryAPI from '../../utilities/request';
import styles from './style.css';

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.post,
      editing: false,
      deleted: false
    };
    this.like = this.like.bind(this);
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.pin = this.pin.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeContent = this.changeContent.bind(this);
  }

  async like() {
    const query = `
    mutation ($postID: ID!) {
      likePost(postID: $postID) {
        likes
        likedByUser
      }
    }
    `;
    const variables = {
      postID: this.state.id
    };
    const { likes, likedByUser } = await queryAPI(query, variables).then(data => {
      console.log(data);
      return data.data.likePost;
    });
    this.setState({ likes, likedByUser });
  }

  async save() {
    const query = `
    mutation ($postID: ID!, $title: String!, $content: String!) {
      updatePost(postID: $postID, title: $title, content: $content) {
        title
        content
      }
    }
    `;
    const variables = {
      postID: this.state.id,
      title: this.state.title,
      content: this.state.content
    };
    const { title, content } = await queryAPI(query, variables).then(data => data.data.updatePost);
    this.setState({ title, content, editing: false });
  }

  edit() {
    if (this.state.editing) {
      // Close
      // Revert to old title and content.
      this.setState(prevState => ({
        editing: !prevState.editing,
        title: prevState.oldTitle,
        content: prevState.oldContent
      }));
    } else {
      // Edit
      // Store original title and content to revert to if user doesn't want to save.
      this.setState(prevState => ({
        editing: !prevState.editing,
        oldTitle: prevState.title,
        oldContent: prevState.content
      }));
    }
  }

  async delete() {
    const query = `
    mutation ($postID: ID!) {
      deletePost(postID: $postID)
    }
    `;
    const variables = {
      postID: this.state.id
    };
    const postToDeleteID = await queryAPI(query, variables).then(data => data.data.deletePost);
    if (postToDeleteID) {
      this.setState({ deleted: true });
    }
  }

  async pin() {
    const query = `
    mutation ($postID: ID!) {
      pinPost(postID: $postID) {
        pinned
      }
    }
    `;
    const variables = {
      postID: this.state.id
    };
    const pinned = await queryAPI(query, variables).then(data => data.data.pinPost.pinned);
    this.setState({ pinned });
  }

  changeTitle(event) {
    this.setState({ title: event.target.value });
  }

  changeContent(event) {
    this.setState({ content: event.target.value });
  }

  render() {
    const post = this.state;
    const { user } = this.props;
    const date = moment(post.createdAt);

    let topBar;
    let content;
    if (post.editing) {
      topBar = (
        <input
          type="text"
          className={styles.editingTitle}
          value={post.title}
          onChange={this.changeTitle}
          placeholder="Title"
          maxLength="100"
          required
        />
      );
      content = (
        <textarea
          className={styles.editingContent}
          value={post.content}
          onChange={this.changeContent}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          tabIndex="0"
          maxLength="10000"
          placeholder="Content"
        />
      );
    } else {
      topBar = (
        <div className={styles.topBar}>
          <h3 className={styles.title}>
            {post.pinned &&
              <i className="fa fa-thumb-tack"></i>
            }
            {post.title}
          </h3>
          <h3 className={styles.author}>{`${post.author.firstName} ${post.author.surname}`}</h3>
        </div>
      );
      content = <div className={styles.content}>{post.content}</div>;
    }

    return post.deleted ? null : (
      <li>
        <article className={classNames(styles.post, { [styles.pinned]: post.pinned })}>
          {topBar}
          <div className={styles.info}>
            <div className={styles.likes}>{`${post.likes} ${post.likes == 1 ? 'like' : 'likes'}`}</div>
            <time
              className={styles.date}
              title={date.format()}
              dateTime={date.toISOString()}
            >{date.fromNow()}</time> 
          </div>
          {content}
          <ul className={styles.actionsBar}>
            <li>
              <button title="Like" onClick={this.like}>
                <i className={classNames('fa', 'fa-heart', { [styles.liked]: post.likedByUser })}></i>
                {post.likedByUser ? 'Liked' : 'Like'}
              </button>
            </li>
            {post.editing &&
              <li>
                <button title="Save" onClick={this.save}>
                  <i className="fa fa-save"></i>
                  Save
                </button>
              </li>
            }
            <li>
              <button title="Edit" onClick={this.edit}>
                <i className={classNames('fa', post.editing ? 'fa-close' : 'fa-pencil')}></i>
                {post.editing ? 'Close' : 'Edit'}
              </button>
            </li>
            <li>
              <button title="Delete" onClick={this.delete}>
                <i className="fa fa-trash"></i>
                Delete
              </button>
            </li>
            {user.userLevel === 'admin' &&
              <li>
                <button title="Pin" onClick={this.pin}>
                  <i className="fa fa-thumb-tack"></i>
                  {post.pinned ? 'Unpin' : 'Pin'}
                </button>
              </li>
            }
          </ul>
        </article>
      </li>
    );
  }
}
