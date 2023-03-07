const {ApolloServer, gql} = require("apollo-server");
const {buildFederatedSchema} = require("@apollo/federation");

const typeDefs = gql`
  extend type Student @key(fields: "libraryNumber") {
    libraryNumber: ID!
    rentedBooks: [Book]
  }

  extend type Book @key(fields: "isbn") {
    isbn: ID!
  }

  extend type Mutation {
    rentBook(isbn: String, libraryNumber: String): [String]
  }
`;

const resolvers = {
  Book: {
    __resolveReference(object) {
      return object;
    },
  },
  Student: {
    __resolveReference(object) {
      return {
        ...object,
        ...bookings.find(
          (booking) => booking.libraryNumber === object.libraryNumber
        ),
      };
    },
  },
  Mutation: {
    rentBook(_, args) {
      bookings
        .find((booking) => booking.libraryNumber === args.libraryNumber)
        .rentedBooks.push(args.isbn);
      return bookings.find(
        (booking) => booking.libraryNumber === args.libraryNumber
      ).rentedBooks;
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

server.listen({port: 4002}).then(({url}) => {
  console.log(`🚀 Server ready at ${url}`);
});

const bookings = [
  {libraryNumber: "1", rentedBooks: [{isbn: "1"}]},
  {libraryNumber: "2", rentedBooks: [{isbn: "2"}]},
];
