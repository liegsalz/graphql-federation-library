const {ApolloServer, gql, MockList} = require("apollo-server");

const typeDefs = gql`
  type Query {
    studentById(libraryNumber: ID!): Student
  }

  extend type Query {
    allStudents: [Student]
  }

  type Student {
    libraryNumber: ID!
    name: String
  }
`;

const mocks = {
  String: () => "This is a wonderful mock!",
};

const server = new ApolloServer({
  typeDefs,
  //mocks: true,
  mocks,
});

server.listen(4711).then(({url}) => {
  console.log(`🚀 Server ready at ${url}`);
});
