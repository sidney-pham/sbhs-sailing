const { makeExecutableSchema } = require('graphql-tools');
const User = require('./models/user');
const Post = require('./models/post');

const typeDefs = `
type Query {
  me: User
  user(id: ID!): User
  newsfeed(sort: String): [Post]!
  raceResults: [Int]!
}

type User {
  firstName: String
  surname: String
  phone: String
  studentID: String
  userLevel: String!
  accountDisabled: Boolean!
  email: String
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  createdAt: String!
  likes: Int!
  pinned: Boolean!
  likedByUser: Boolean!
}

type Mutation {
  addPost(
    title: String!
    content: String!
  ): Post
  likePost(
    postID: ID!
  ): Post
  pinPost(
    postID: ID!
  ): Post
  updatePost(
    postID: ID!
    title: String!
    content: String!
  ): Post
  deletePost(
    postID: ID!
  ): ID
}

schema {
  query: Query
  mutation: Mutation
}
`;

const resolvers = {
  Query: {
    me: (_parentValue, _args, req) => {
      if (!req.session.userID) {
        return null;
      }
      return User.getByID(req.session.userID);
    },
    user: (_parentValue, { id }) => User.getByID(id),
    newsfeed: (_parentValue, { sort }, req) => Post.getPosts(req.session.userID, sort),
    raceResults: () => [1, 3, 5, 6, 12, 2]
  },
  Mutation: {
    addPost: (_parentValue, { title, content }, req) => (
      Post.addPost(title, content, req.session.userID)
    ),
    likePost: (_parentValue, { postID }, req) => Post.like(postID, req.session.userID),
    pinPost: (_parentValue, { postID }, req) => Post.pin(postID, req.session.userID),
    updatePost: (_parentValue, { postID, title, content }, req) => (
      Post.update(postID, req.session.userID, title, content)
    ),
    deletePost: (_parentValue, { postID }, req) => Post.delete(postID, req.session.userID)
  },
  User: {
    firstName: parentValue => parentValue.first_name,
    surname: parentValue => parentValue.surname,
    phone: parentValue => parentValue.phone,
    studentID: parentValue => parentValue.student_id,
    userLevel: parentValue => parentValue.user_level,
    accountDisabled: parentValue => parentValue.account_disabled,
    email: parentValue => parentValue.email
  },
  Post: {
    id: parentValue => parentValue.id,
    title: parentValue => parentValue.title,
    content: parentValue => parentValue.content,
    author: parentValue => User.getByID(parentValue.created_by),
    createdAt: parentValue => parentValue.created_at.toISOString(),
    likes: parentValue => parentValue.likes,
    pinned: parentValue => parentValue.pinned,
    likedByUser: parentValue => parentValue.user_liked
  }
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});
