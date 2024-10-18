<template>
  <PageLayout class="tasks-page">
    <q-table
      :rows="tasks"
      :columns="columnsForTaskTable"
      row-key="id"
      no-data-label="No tasks found"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>{{ props.row.name }}</q-td>
          <q-td>{{ props.row.id }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";

import { useQuasar } from "quasar";

import PageLayout from "@/components/PageLayout.vue";
import { useQuery } from "@vue/apollo-composable";

import { getAllTasks } from "@/api";

const $q = useQuasar();

const tasks = ref([]);

const columnsForTaskTable = [
  {
    name: "name",
    label: "Task Name",
    field: "name",
    align: "left",
  },
  {
    name: "id",
    label: "Task Id",
    field: "id",
    align: "left",
  },
];

const loadTasks = async () => {
  const response = await getAllTasks();

  if (response) {
    tasks.value = response;
  }

  // if (error.value) {
  //   $q.notify({
  //     type: "negative",
  //     message: "Failed to load tasks",
  //   });
  // }
};

onMounted(() => {
  loadTasks();
});
</script>

<style scoped>
.tasks-page {
  background: linear-gradient(115deg, #fdf3ff, #e1bee7);
}
</style>
