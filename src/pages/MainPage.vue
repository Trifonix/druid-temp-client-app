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
            @click="SELECT_GROUP_AND_SHOW_USERS_TABLE(page)"
            :class="{ 'nested-group': page.name !== 'Команда'}"
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
              <h5>{{ selectedPage.id }}</h5>
              <q-table
                v-if="members.length > 0"
                :rows="members"
                :columns="columns"
                row-key="id"
              />
              <div v-else>
                <h6>Кажется, в этой группе нет участников</h6>
              </div>
            </div>
            <div v-else>
              <h5>Выберите страницу из дерева страниц слева, чтобы увидеть контент выбранной страницы</h5>
            </div>
          </q-card-section>
        </q-card>

      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useQuery, useApolloClient } from "@vue/apollo-composable";
import gql from "graphql-tag";

const apolloClient = useApolloClient().client;
const router = useRouter();

const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("space");
  apolloClient.clearStore();
  router.push({ name: "login" });
};

// Выводим все группы пространства
const GET_ALL_SPACE_GROUP_IDS_AND_NAMES = gql`
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
const { result, loading, error } = useQuery(GET_ALL_SPACE_GROUP_IDS_AND_NAMES, {
  fetchPolicy: "cache-only",
});
watchEffect(() => {
  if (result.value && result.value.paginate_group) {
    pages.value = result.value.paginate_group.data;
  }
});
// Закончили вывод всех групп пространства

// 3.2.	При выборе в дереве группы выводить таблицу ее участников
const pages = ref([]);
const selectedPage = ref(null);
const members = ref([]);
const columns = [
  { name: 'first_name', label: 'Имя', field: row => row.fullname.first_name, align: 'left' },
  { name: 'last_name', label: 'Фамилия', field: row => row.fullname.last_name, align: 'left' }
];
const SELECT_GROUP_AND_SHOW_USERS_TABLE = async (page) => {
  selectedPage.value = page;
  const { data } = await apolloClient.query( {
    query: gql`
      query ($id: String!) {
        get_group(id: $id) {
          subject {
            object {
              id
              fullname {
                first_name
                last_name
              }
            }
          }
        }
      }
    `,
    variables: { id: page.id },
    fetchPolicy: "network-only"
  });
  members.value = data.get_group.subject.map(item => item.object);
};
// КОНЕЦ --- 3.2.	При выборе в дереве группы выводить таблицу ее участников

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
.nested-group {
  margin-left: 1em;
  box-shadow: -2px -2px 4px rgba(63, 81, 181, 0.4);
}
</style>
