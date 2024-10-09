<template>
  <q-page class="main-page">
    <div class="row full-height">
      <div class="col-3 page-tree q-pa-md">
        <div class="logout-container q-mb-md">
          <q-btn
            label="Выйти"
            color="red"
            size="lg"
            @click="logout"
            class="full-width"
          />
        </div>

        <q-list bordered>
          <q-item
            clickable
            v-for="page in pages"
            :key="page.id"
            @click="selectPage(page)"
          >
            <q-item-section>
              <q-item-label>{{ page.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col q-pa-md">
        <q-card>
          <q-card-section>
            <div v-if="selectedPage">
              <h3>{{ selectedPage.name }}</h3>
              <p>Здесь можно добавить контент для страницы.</p>
            </div>
            <div v-else>
              <h4>Выберите страницу из дерева страниц слева, чтобы увидеть контент выбранной страницы</h4>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

const router = useRouter();

const pages = ref([]);

const selectedPage = ref(null);

const selectPage = (page) => {
  selectedPage.value = page;
};

const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("space");
  router.push({ name: "login" });
};

const GET_GROUPS = gql`
  {
    paginate_group(
      page: 1
      perPage: 100
    ) {
      data {
          id
          name
      }
    }
  }
`;

const { result, loading, error } = useQuery(GET_GROUPS);

onMounted(() => {
  if (result.value && result.value.paginate_group) {
    pages.value = result.value.paginate_group.data;
  }
});
</script>

<style scoped>
.main-page {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  min-height: 100vh;
}
.full-height {
  height: 100%;
}
.page-tree {
  border-right: 3px dotted #bbb;
  border-radius: 24px;
}
.logout-container {
  margin-bottom: 20px;
}
.full-width {
  width: 100%;
}
</style>
