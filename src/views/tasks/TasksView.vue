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
          <q-td>{{ props.row.task_description }}</q-td>
          <q-td>
            {{
              (props.row.worker?.object?.fullname?.first_name || "") +
              " " +
              (props.row.worker?.object?.fullname?.last_name || "")
            }}
          </q-td>
          <q-td>
            {{
              props.row.status === "4123856274852877817"
                ? "Назначена"
                : props.row.status === "4210340405255089394"
                ? "Выполнена"
                : props.row.status === "5451118349350597926"
                ? "Завершена"
                : "Неизвестно"
            }}
          </q-td>
          <q-btn
              color="orange-9"
              label="Удалить задачу"
              @click="deleteTaskFromAllTasksHandler(props.row.id)"
          ></q-btn>
        </q-tr>
      </template>
    </q-table>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useModulesStore } from "@/stores/modulesStore";
import { useQuasar } from "quasar";
import PageLayout from "@/components/PageLayout.vue";
import { getAllTasks } from "@/api";

const $q = useQuasar();
const moduleStore = useModulesStore();
const tasks = ref([]);

const columnsForTaskTable = [
  {
    name: "name",
    label: "Task Name",
    field: "name",
    align: "left",
  },
  {
    name: "task_description",
    label: "Desc",
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

const loadTasks = async () => {
  const response = await getAllTasks();
  if (response) {
    tasks.value = response;
  }
};

const deleteTaskFromAllTasksHandler = async (taskId) => {
  const taskWasDeleted = await moduleStore.deleteTaskFromAllTasksHandler(taskId, $q);
  if (taskWasDeleted) tasks.value = tasks.value.filter(task => task.id !== taskId);
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
