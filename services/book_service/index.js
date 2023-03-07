const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    allBooks: [Book]
    bookByIsbn(isbn: ID!): [Book]
  }

  type Book @key(fields: "isbn") {
    isbn: ID!
    name: String
    authors: [String]
  }
`;

const resolvers = {
  Book: {
    __resolveReference(ref) {
      return books.find(book => book.isbn === ref.isbn);
    }
  },
  Query: {
    bookByIsbn(_, args) {
      console.log(args.isbn)
      return books.find(book => book.isbn === args.isbn);
    },
    allBooks() {
      return books;
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`Service status UP with URL: ${url}`);
});

const books = [
  {
    isbn: "1",
    name: "Clean code",
    authors: ["Dr. A", "Dr. B"],
  },
  {
    isbn: "2",
    name: "Clean architechture",
    authors: ["Dr. C"],
  },
  {
    isbn: "3",
    name: "Clean testing",
    authors: ["Dr. D"],
  }
];
