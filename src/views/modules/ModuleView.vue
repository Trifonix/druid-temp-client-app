<template>
  <PageLayout class="module-page">
    <CreateTaskForm :module="module" />

    <h4>Задачи модуля |- {{ module.module_name }} -|</h4>

    <q-table
      v-if="module.tasks && module.tasks.length > 0"
      :rows="module.tasks"
      :columns="columnsForTaskTable"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>{{ props.row?.name }}</q-td>
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
        </q-tr>
      </template>
    </q-table>

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
import CreateTaskForm from "@/components/createTaskForm.vue";

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
  const moduleData = moduleStore.getModuleById(moduleId.value);
  if (moduleData) {
    const tasks = moduleData.tasks.map(task => task.object);
    module.value = {
      ...moduleData,
      tasks,
    };
  }
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

watch(
    () => moduleStore.modules,
    () => {
        initializeModule();
    }
);
</script>

<style scoped>
.module-page {
  background: linear-gradient(115deg, #fff3f3, #e7bebe);
}
</style>
