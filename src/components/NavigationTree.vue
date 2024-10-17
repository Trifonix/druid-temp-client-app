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
      <q-item
        clickable
        v-for="group in allSpaceGroups"
        :key="group.id"
        @click="goToGroupPage(group)"
        :class="{ 'nested-group': group.name !== 'Команда' }"
      >
        <q-item-section>
          <q-item-label>{{ group.name }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-for="page in allSpacePagesWithoutGroups"
        :key="page.id"
        @click="goToPage(page)"
      >
        <q-item-section>
          <q-item-label>{{ page.title }}</q-item-label>
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

const router = useRouter();

const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("space");
  apolloClient.clearStore();
  router.push({ name: "login" });
};

const allSpaceGroups = ref([]);
const allSpacePagesWithoutGroups = ref([]);

const fetchAllSpaceGroups = async () => {
  allSpaceGroups.value = await getAllSpaceGroups();
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

const goToPage = (page) => {
  if (page.title === "Модули") {
    router.push({ name: "modules" });
  }
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
