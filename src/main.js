import { createApp, provide, h } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "./apolloClient";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

const pinia = createPinia();

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

app.use(pinia);
app.use(Quasar, quasarUserOptions);
app.use(router);
app.mount("#app");
