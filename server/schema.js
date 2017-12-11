const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = `
type Query {
  newsfeed: [Post]!
  raceResults: [Int]!
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
  }
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});
