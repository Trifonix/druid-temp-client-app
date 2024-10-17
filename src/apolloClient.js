import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  from,
} from "@apollo/client/core";

const httpLink = createHttpLink({
  uri: "https://app.stud.druid.1t.ru/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("access_token") || "";
  const space = localStorage.getItem("space") || "";
  operation.setContext({
    headers: {
      Authorization: `Bearer ${token}`,
      space: space,
    },
  });
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
