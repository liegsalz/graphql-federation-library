const {ApolloServer} = require("apollo-server");
const {ApolloGateway, IntrospectAndCompose} = require("@apollo/gateway");
const {serializeQueryPlan} = require("@apollo/query-planner");

const supergraphSdl = new IntrospectAndCompose({
  subgraphs: [
    {name: "student_service", url: "http://localhost:4001/graphql"},
    {name: "rental_service", url: "http://localhost:4002/graphql"},
    {name: "book_service", url: "http://localhost:4003/graphql"},
  ],
});

const gateway = new ApolloGateway({
  supergraphSdl,
  // Experimental: Enabling this enables the query plan view in Playground.
  __exposeQueryPlanExperimental: true,
  experimental_didResolveQueryPlan: function (options) {
    if (options.requestContext.operationName !== "IntrospectionQuery") {
      console.log(serializeQueryPlan(options.queryPlan));
    }
  },
});

(async () => {
  const server = new ApolloServer({
    gateway,
  });

  server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(supergraphSdl);
  });
})();
