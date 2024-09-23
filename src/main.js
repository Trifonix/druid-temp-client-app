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

// Создание Apollo Client
const httpLink = createHttpLink({
    uri: "https://app.stud.druid.1t.ru/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
    // Добавляем токен в заголовки
    operation.setContext({
        headers: {
            authorization: localStorage.getItem("token") || "", // Используйте свой способ получения токена
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
        provide(DefaultApolloClient, apolloClient); // Предоставляем Apollo Client
    },
    render: () => h(App),
});

app.use(Quasar, quasarUserOptions);
app.use(router);
app.mount("#app");
