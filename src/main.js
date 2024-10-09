import { createApp, provide, h } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  from,
} from "@apollo/client/core";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import App from "./App.vue";
import router from "./router";

const httpLink = createHttpLink({
  uri: "https://app.stud.druid.1t.ru/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      space: `${localStorage.getItem("space") || ""}`,
    },
  });
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

app.use(Quasar, quasarUserOptions);
app.use(router);
app.mount("#app");
