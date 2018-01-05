const { makeExecutableSchema } = require('graphql-tools');
const User = require('./models/user');

const typeDefs = `
type Query {
  me: User
  user(id: ID!): User
  newsfeed: [Post]!
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
  title: String!
  author: Author!
  content: String!
}

type Author {
  name: String!
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
    newsfeed: () => [
      {
        title: 'Hello, World!',
        content: 'First post here.',
        author: {
          name: 'Sidney Pham'
        }
      }
    ],
    raceResults: () => [1, 3, 5, 6, 12, 2]
  },
  User: {
    firstName: parentValue => parentValue.first_name,
    surname: parentValue => parentValue.surname,
    phone: parentValue => parentValue.phone,
    studentID: parentValue => parentValue.student_id,
    userLevel: parentValue => parentValue.user_level,
    accountDisabled: parentValue => parentValue.account_disabled,
    email: parentValue => parentValue.email
  }
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});
