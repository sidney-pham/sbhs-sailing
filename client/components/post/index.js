import React from 'react';
import classNames from 'classnames';
import styles from './style.css';

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    // TODO: Use spread syntax.
    this.state = {
      post: Object.assign(this.props.post, {
        likes: 0,
        pinned: false,
        deleted: false
      })
    };
    this.like = this.like.bind(this);
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.pin = this.pin.bind(this);
  }

  like() {

  }

  save() {

  }

  edit() {

  }

  delete() {

  }

  pin() {
    this.setState(prevState => ({
      pinned: !prevState.pinned
    }));
  }

  render() {
    const { post } = this.state;
    return (
      <li>
        <article className={classNames(styles.post, { [styles.pinned]: this.state.pinned })}>
          <div className={styles.topBar}>
            <h3 className={styles.title}>{post.title}</h3>
            <h3 className={styles.author}>{post.author.name}</h3>
          </div>
          <div className={styles.info}>
            <div className={styles.likes}>1 like</div>
            <time className={styles.date}>a month ago</time>
          </div>
          <div className={styles.content}>{post.content}</div>
          <ul className={styles.actionsBar}>
            <li><button title="Like" onClick={this.like}><i className="fa fa-heart"></i>Like</button></li>
            <li><button title="Save" onClick={this.save}><i className="fa fa-save"></i>Save</button></li>
            <li><button title="Edit" onClick={this.edit}><i className="fa fa-pencil"></i>Edit</button></li>
            <li><button title="Delete" onClick={this.delete}><i className="fa fa-trash"></i>Delete</button></li>
            <li><button title="Pin" onClick={this.pin}><i className="fa fa-thumb-tack"></i>{this.state.pinned ? 'Unpin' : 'Pin'}</button></li>
          </ul>
        </article>
      </li>
    );
  }
}
