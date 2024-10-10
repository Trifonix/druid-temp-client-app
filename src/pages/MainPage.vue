<template>
  <q-page class="main-page">
    
    <div class="row full-height">
      <div class="col-3 page-tree q-pa-md">
        
        <div class="logout-container q-mb-md">
          <q-btn
            label="Выйти из системы"
            color="pink-14"
            size="md"
            @click="logout"
            class="full-width"
          />
        </div>

        <q-list bordered>

          <q-item
            clickable
            v-for="group in allSpaceGroups"
            :key="group.id"
            @click="SELECT_GROUP_AND_SHOW_USERS_TABLE(group)"
            :class="{ 'nested-group': group.name !== 'Команда'}"
          >
            <q-item-section>
              <q-item-label>{{ group.name }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-for="page in allSpacePagesWithoutGroups"
            :key="page.id"
            @click="page.title === 'Модули' ? fetchModules() : null"
          >
            <q-item-section>
              <q-item-label>{{ page.title }}</q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
      
      </div>

      <div class="col q-pa-md">
        
        <q-card>
          <q-card-section>

            <div class="invite-form row items-center full-width" v-if="selectedGroup">
              <q-input v-model="inviteData.name" label="Имя" class="col q-mr-sm" outlined />
              <q-input v-model="inviteData.surname" label="Фамилия" class="col q-mr-sm" outlined />
              <q-input v-model="inviteData.email" label="Email" class="col q-mr-sm" outlined type="email" />
              <q-btn
                label="Пригласить в эту группу"
                color="primary"
                @click="inviteUser"
                class="q-mb-mt"
              />
            </div>

            <div v-if="selectedGroup">
              <h3>{{ selectedGroup.name }}</h3>
              <h5>{{ selectedGroup.id }}</h5>
              <q-table
                v-if="members.length > 0"
                :rows="members"
                :columns="columns"
                row-key="id"
              />
              <div v-else>
                <h6>Кажется, в этой группе нет участников...</h6>
              </div>
            </div>

            <div v-else-if="isModulesPageSelected">
              <q-table
                :rows="modules"
                row-key="id"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td>{{ props.row.name }}</q-td>
                    <q-td>{{ props.row.id }}</q-td>
                  </q-tr>
                </template>
              </q-table>
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
import { useQuery, useApolloClient, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

const apolloClient = useApolloClient().client;
const router = useRouter();

const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("space");
  apolloClient.clearStore();
  router.push({ name: "login" });
};

// Сбор всех групп пространства
const allSpaceGroups = ref([]);
const selectedGroup = ref(null);
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
  fetchPolicy: "cache-and-network",
});
// КОНЕЦ --- Сбор всех групп пространства

// 3.2.	При выборе в дереве группы выводить таблицу ее участников
const members = ref([]);
const columns = [
  { name: 'first_name', label: 'First name', field: row => row.fullname.first_name, align: 'left' },
  { name: 'last_name', label: 'Last name', field: row => row.fullname.last_name, align: 'left' },
  { name: 'email', label: 'Email', field: row => row.email.email, align: 'left' }
];
const SELECT_GROUP_AND_SHOW_USERS_TABLE = async (group) => {
  alert(isModulesPageSelected.value);
  isModulesPageSelected.value = false;
  selectedGroup.value = group;
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
              email {
                email
              }
            }
          }
        }
      }
    `,
    variables: { id: group.id },
    fetchPolicy: "network-only"
  });
  members.value = data.get_group.subject.map(item => item.object);
};
// КОНЕЦ --- 3.2.	При выборе в дереве группы выводить таблицу ее участников

// 3.3.	На страницу участников добавить функционал приглашения участников в приложение в нужную группу.
const inviteData = ref({ name: '', surname: '', email: '' });
const INVITE_NEW_USER_IN_CURRENT_GROUP = gql`
  mutation InviteUser($input: SpaceInviteUserInput!) {
    spaceInviteUser(input: $input) {
      status
    }
  }
`;
const { mutate: inviteUserMutation } = useMutation(INVITE_NEW_USER_IN_CURRENT_GROUP);
const inviteUser = () => {
  const input = {
    name: inviteData.value.name,
    surname: inviteData.value.surname,
    email: inviteData.value.email,
    group_id: selectedGroup.value.id
  };

  inviteUserMutation({ input }).then(({ data }) => {
    if (data.spaceInviteUser.status === 200) {
      alert('Пользователь успешно приглашен!');
    } else {
      alert('Не удалось пригласить пользователя.');
    }
  });
};
// КОНЕЦ --- 3.3.	На страницу участников добавить функционал приглашения участников в приложение в нужную группу.

// 4.1. В дереве вывести страницу Модули на уровне страницы Команда
const allSpacePagesWithoutGroups = ref([]);
const GET_ALL_SPACE_PAGES = gql`
  query {
    pages(perPage: 255) { 
      data {
        title
        id
        parent_id
      }
    }
  }
`;
const fetchallSpacePagesWithoutGroups = async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_ALL_SPACE_PAGES,
      fetchPolicy: "network-only"
    });
    if (data && data.pages) {
      const groupsData = allSpaceGroups.value.map(group => group.name);
      allSpacePagesWithoutGroups.value = data.pages.data.filter(page => !groupsData.includes(page.title));
    }
  } catch (error) {
    console.error("Ошибка при получении страниц:", error);
  }
};
watchEffect(() => {
  if (result.value && result.value.paginate_group) {
    allSpaceGroups.value = result.value.paginate_group.data;
    if (allSpaceGroups.value.length > 0) {
      fetchallSpacePagesWithoutGroups();
    }
  }
});
// КОНЕЦ --- 4.1. В дереве вывести страницу Модули на уровне страницы Команда

// 4.2. При выборе страницы Модули в контенте выводить таблицу с полями объекта Модуль и количество его задач в каждом статусе
const modules = ref([]);
const isModulesPageSelected = ref(false);
const GET_MODULES = gql`
  query {
    paginate_type1(
      page: 1
      perPage: 255
    ) {
      data {
        id
        name
      }
      paginatorInfo {
        count
      }
    }
  }
`;
const fetchModules = async () => {
  alert(isModulesPageSelected.value);
  isModulesPageSelected.value = true;
  const { data } = await apolloClient.query({
    query: GET_MODULES,
    fetchPolicy: "network-only"
  });
  modules.value = data.paginate_type1.data;
  alert(isModulesPageSelected.value);
};
//  КОНЕЦ --- 4.2. При выборе страницы Модули в контенте выводить таблицу с полями объекта Модуль и количество его задач в каждом статусе
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
  box-shadow: -4px 0 8px rgba(63, 81, 181, 0.2), 
              -8px 0 6px rgba(63, 81, 181, 0.1);
}
.invite-form {
  display: flex;
  width: 100vw;
}
</style>
