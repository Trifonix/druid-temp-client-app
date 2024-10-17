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
import gql from "graphql-tag";

const $q = useQuasar();

const GET_TASKS = gql`
  {
    paginate_task(page: 1, perPage: 100) {
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

const tasks = ref([]);

onMounted(() => {
  loadTasks();
});

const loadTasks = () => {
  const { result, loading, error } = useQuery(GET_TASKS);
  result.value?.paginate_task.data &&
    (tasks.value = result.value.paginate_task.data);
  if (error.value) {
    $q.notify({
      type: "negative",
      message: "Failed to load tasks",
    });
  }
};
</script>

<style scoped>
.tasks-page {
  background: linear-gradient(115deg, #fdf3ff, #e1bee7);
}
</style>
