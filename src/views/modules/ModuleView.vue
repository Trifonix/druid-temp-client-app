<template>
  <PageLayout class="module-page">
    <h3>{{ module.module_name }}</h3>

    <q-table
      v-if="module.tasks > 0"
      :rows="module.tasks"
      :columns="columnsForTaskTable"
      row-key="id"
    />

    <div v-else>
      <h6>Кажется, в этом модуле нет задач...</h6>
    </div>
  </PageLayout>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useModulesStore } from "@/stores/modulesStore";

import PageLayout from "@/components/PageLayout.vue";

const route = useRoute();
const moduleId = ref(route.params.moduleId);

const moduleStore = useModulesStore();

const module = ref({});

const columnsForTaskTable = [
  {
    name: "name",
    label: "Task Name",
    field: "name",
    align: "left",
  },
  {
    name: "task_description",
    label: "Description",
    field: "task_description",
    align: "left",
  },
  {
    name: "worker",
    label: "Worker",
    field: "worker",
    align: "left",
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    align: "left",
  },
];

const initializeModule = () => {
  module.value = moduleStore.getModuleById(moduleId.value);
};

watch(
  () => route.params.moduleId,
  (newModuleId) => {
    moduleId.value = newModuleId;
    initializeModule();
  }
);

onMounted(async () => {
  await initializeModule();

  if (!module.value) {
    await moduleStore.fetchModule(moduleId.value);
    initializeModule();
  }
});
</script>

<style scoped>
.module-page {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
}
</style>
