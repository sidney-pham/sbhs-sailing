const { makeExecutableSchema } = require('graphql-tools');
const User = require('./models/user');
const Post = require('./models/post');
const Roster = require('./models/roster');

const typeDefs = `
type Query {
  me: User
  user(id: ID!): User
  newsfeed(sort: String): [Post]!
  events(sort: String): [Event]!
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
  markdownContent: String!
  author: User!
  createdAt: String!
  likes: Int!
  pinned: Boolean!
  likedByUser: Boolean!
}

type Event {
  id: ID!
  eventName: String!
  startDate: String!
  endDate: String
  location: String!
  details: String
  boats: [Boat]!
}

type Boat {
  id: ID!
  skipper: String!
  crew: String!
  boat: String!
  sailNumber: String!
}

input PostInput {
  title: String!
  content: String!
}

input EventInput {
  eventName: String!
  startDate: String!
  endDate: String
  location: String!
  details: String
  boats: [BoatInput]!
}

input BoatInput {
  skipper: String!
  crew: String!
  boat: String!
  sailNumber: String!
}

type Mutation {
  addPost(post: PostInput!): Post
  likePost(postID: ID!): Post
  pinPost(postID: ID!): Post
  updatePost(postID: ID!, post: PostInput!): Post
  deletePost(postID: ID!): ID
  addEvent(event: EventInput!): Event
  updateEvent(eventID: ID!, event: EventInput!): Event
  deleteEvent(eventID: ID!): ID
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
    newsfeed: (_parentValue, { sort }, req) => Post.getAll(req.session.userID, sort),
    events: (_parentValue, { sort }) => Roster.getAll(sort)
  },
  Mutation: {
    addPost: (_parentValue, { post: { title, content } }, req) => (
      Post.add(title, content, req.session.userID)
    ),
    likePost: (_parentValue, { postID }, req) => Post.like(postID, req.session.userID),
    pinPost: (_parentValue, { postID }, req) => Post.pin(postID, req.session.userID),
    updatePost: (_parentValue, { postID, post: { title, content } }, req) => (
      Post.update(postID, req.session.userID, title, content)
    ),
    deletePost: (_parentValue, { postID }, req) => Post.delete(postID, req.session.userID),
    addEvent: (_parentValue, {
      event: {
        eventName,
        startDate,
        endDate,
        location,
        details,
        boats
      }
    }, req) => Roster.add(eventName, startDate, endDate, location, details, boats, req.session.userID),
    updateEvent: (_parentValue, {
      eventID,
      event: {
        eventName,
        startDate,
        endDate,
        location,
        details,
        boats
      }
    }, req) => Roster.add(eventID, eventName, startDate, endDate, location, details, boats, req.session.userID),
    deleteEvent: (_parentValue, { eventID }, req) => Roster.delete(eventID, req.session.userID)
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
    markdownContent: parentValue => parentValue.markdown_content,
    author: parentValue => User.getByID(parentValue.created_by),
    createdAt: parentValue => parentValue.created_at.toISOString(),
    likes: parentValue => parentValue.likes,
    pinned: parentValue => parentValue.pinned,
    likedByUser: parentValue => parentValue.user_liked
  },
  Event: {
    eventName: parentValue => parentValue.event_name,
    startDate: parentValue => parentValue.start_date,
    endDate: parentValue => parentValue.end_date,
    location: parentValue => parentValue.location,
    details: parentValue => parentValue.other_details,
    boats: parentValue => parentValue.boats
  },
  Boat: {
    skipper: parentValue => parentValue.skipper,
    crew: parentValue => parentValue.crew,
    boat: parentValue => parentValue.boat_name,
    sailNumber: parentValue => parentValue.sail_number
  }
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});
