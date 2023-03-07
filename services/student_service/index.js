const {ApolloServer, gql} = require("apollo-server");
const {buildFederatedSchema} = require("@apollo/federation");

const typeDefs = gql`
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  extend type Query @cacheControl(maxAge: 10) {
    studentById(libraryNumber: ID!): Student
  }

  extend type Query @cacheControl(maxAge: 10) {
    allStudents: [Student] @cacheControl(maxAge: 10)
  }

  type Student @key(fields: "libraryNumber") @cacheControl(maxAge: 10) {
    libraryNumber: ID!
    name: String
  }
`;

const resolvers = {
  Query: {
    studentById(_, args) {
      return students.find(
        (student) => student.libraryNumber === args.libraryNumber
      );
    },
    allStudents(_, {id}, __, info) {
      info.cacheControl.setCacheHint({maxAge: 60});
      return getStudents();
    },
  },
  Student: {
    __resolveReference(ref, {id}, __, info) {
      info.cacheControl.setCacheHint({maxAge: 60});
      return students.find(
        (student) => student.libraryNumber === ref.libraryNumber
      );
    },
  },
};

const mocks = {
  ID: () => "123456789",
  String: () => "Pistacho",
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
      mocks,
    },
  ]),
});

server.listen({port: 4001}).then(({url}) => {
  console.log(`Service status UP with URL: ${url}`);
});

const getStudents = async () => {
  return students;
};
const students = [
  {
    libraryNumber: "1",
    name: "Bryan",
  },
  {
    libraryNumber: "2",
    name: "Emilia",
  },
];
