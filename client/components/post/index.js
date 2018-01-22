import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import ResizingTextarea from '../resizing-textarea';
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
    const { likes, likedByUser } = await queryAPI(query, variables).then(data => data.data.likePost);
    this.setState({ likes, likedByUser });
  }

  async save(event) {
    event.preventDefault();
    const query = `
    mutation ($postID: ID!, $post: PostInput!) {
      updatePost(postID: $postID, post: $post) {
        title
        content
        markdownContent
      }
    }
    `;
    const variables = {
      postID: this.state.id,
      post: {
        title: this.state.title,
        content: this.state.content
      }
    };
    const { title, content, markdownContent } = await queryAPI(query, variables).then(data => data.data.updatePost);
    this.setState({ title, content, markdownContent, editing: false });
  }

  edit() {
    if (this.state.editing) {
      // Close
      const {
        title,
        oldTitle,
        content,
        oldContent
      } = this.state;
      const changed = (title !== oldTitle) || (content !== oldContent);

      // Make sure no changes are lost.
      if (!changed || (changed && confirm('Are you sure you want to lose your changes?'))) {
        // Revert to old title and content.
        this.setState(prevState => ({
          editing: !prevState.editing,
          title: prevState.oldTitle,
          content: prevState.oldContent
        }));
      }
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
    if (window.confirm('Are you sure you want to delete this post?')) {
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

    // Refresh posts so newly pinned post floats to top or returns back if unpinned.
    this.props.refreshPosts();
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
        <ResizingTextarea
          className={styles.editingContent}
          value={post.content}
          onChange={this.changeContent}
          maxLength="10000"
          placeholder="Content"
          autoFocus
          required
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
      content = <div className={styles.content} dangerouslySetInnerHTML={{__html: post.markdownContent}}></div>;
    }

    return post.deleted ? null : (
      <li>
        <article className={classNames(styles.post, { [styles.pinned]: post.pinned })}>
          <form onSubmit={this.save}>
            {topBar}
            <div className={styles.info}>
              <div className={styles.likes}>{`${post.likes} ${post.likes == 1 ? 'like' : 'likes'}`}</div>
              <time className={styles.date} title={date.format()} dateTime={date.toISOString()}>
                {date.fromNow()}
              </time>
            </div>
            {content}
            <ul className={styles.actionsBar}>
              <li>
                <button type="button" title="Like" onClick={this.like}>
                  <i className={classNames('fa', post.likedByUser ? 'fa-heart' : 'fa-heart-o', { [styles.liked]: post.likedByUser })}></i>
                  {post.likedByUser ? 'Liked' : 'Like'}
                </button>
              </li>
              {post.editing &&
                <li>
                  <button type="submit" title="Save">
                    <i className="fa fa-save"></i>
                    Save
                  </button>
                </li>
              }
              <li>
                <button type="button" title="Edit" onClick={this.edit}>
                  <i className={classNames('fa', post.editing ? 'fa-close' : 'fa-pencil')}></i>
                  {post.editing ? 'Close' : 'Edit'}
                </button>
              </li>
              <li>
                <button type="button" title="Delete" onClick={this.delete}>
                  <i className="fa fa-trash"></i>
                  Delete
                </button>
              </li>
              {user.userLevel === 'admin' &&
                <li>
                  <button type="button" title="Pin" onClick={this.pin}>
                    <i className="fa fa-thumb-tack"></i>
                    {post.pinned ? 'Unpin' : 'Pin'}
                  </button>
                </li>
              }
            </ul>
          </form>
        </article>
      </li>
    );
  }
}
