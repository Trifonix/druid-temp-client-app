<template>
  <div class="page-tree q-pa-md">
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

      <q-item clickable @click="toggleTeamPages(groupTeam)">
        <q-item-section>
          <q-item-label>Команда</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="teamChildrenVisible"
        clickable
        v-for="group in allSpaceGroups.filter(group => group.name !== 'Команда')"
        :key="group.id"
        @click="goToGroupPage(group)"
        class="nested-group"
      >
        <q-item-section>
          <q-item-label>{{ group.name }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable key="modules" @click="toggleModulePages(pageModules)">
        <q-item-section>
          <q-item-label>Модули</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="moduleChildrenVisible"
        clickable
        v-for="module in moduleStore.modules"
        :key="module.id"
        @click="toggleModulePages(module)"
        class="nested-group"
      >
        <q-item-section>
          <q-item-label>{{ module.module_name }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable key="tasks" @click="goToTasks">
        <q-item-section>
          <q-item-label>Мои задачи</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { getAllSpaceGroups, getAllSpacePages } from "@/api";
import { apolloClient } from "@/apolloClient";

import { useModulesStore } from "@/stores/modulesStore";
import { useAuthStore } from "@/stores/authStore";

const moduleStore = useModulesStore();
const authStore = useAuthStore();

const router = useRouter();

const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("space");
  localStorage.removeItem("user");
  apolloClient.clearStore();
  router.push("/login");
};

const allSpaceGroups = ref([]);
const allSpacePagesWithoutGroups = ref([]);
const teamChildrenVisible = ref(false);
const moduleChildrenVisible = ref(false);
const groupTeam = ref();
const pageModules = ref(false);

const toggleTeamPages = (group) => {
  teamChildrenVisible.value = !teamChildrenVisible.value;
  goToGroupPage(group);
};

const toggleModulePages = (module) => {
  console.log(module);
  moduleChildrenVisible.value = !moduleChildrenVisible.value;
  if (!module) router.push({ name: "modules" });
  else goToModulePage(module);
};

const fetchAllSpaceGroups = async () => {
  allSpaceGroups.value = await getAllSpaceGroups();
  groupTeam.value = allSpaceGroups.value[0];
};

watchEffect(fetchAllSpaceGroups);

const fetchAllSpacePagesWithoutGroups = async () => {
  const pages = await getAllSpacePages();
  const groupsData = allSpaceGroups.value.map((group) => group.name);
  allSpacePagesWithoutGroups.value = pages.filter(
    (page) => !groupsData.includes(page.title)
  );
};

watchEffect(() => {
  if (allSpaceGroups.value.length > 0) {
    fetchAllSpacePagesWithoutGroups();
  }
});

const goToGroupPage = (group) => {
  router.push({ name: "group", params: { groupId: group.id } });
};

const goToModulePage = (module) => {
  router.push({ name: "module", params: { moduleId: module.id } });
};

const goToTasks = () => {
  router.push({ name: "tasks" });
};
</script>

<style scoped>
.page-tree {
  border-right: 3px dotted #bbb;
  border-radius: 24px;
  width: 20%;
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
</style>
