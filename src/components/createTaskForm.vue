<template>
  <div class="create-task-form row items-center full-width">
    <q-input
      v-model="taskData.name"
      label="Название"
      class="col q-mr-sm"
      outlined
    />
    <q-input
      v-model="taskData.task_description"
      label="Описание"
      class="col q-mr-sm"
      outlined
    />

    <q-select
      v-model="taskData.worker"
      :options="workers"
      label="Исполнитель"
      outlined
      class="col q-mr-sm"
      option-value="id"
      option-label="select_name"
    />

    <q-btn
      label="Создать задачу"
      color="primary"
      @click="createTaskHandler"
      class="q-mb-mt"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import { useModulesStore } from "@/stores/modulesStore";
import { useGroupStore } from "@/stores/groupStore";

import { useQuasar } from "quasar";

const props = defineProps({
  module: Object,
});

const emit = defineEmits(["createTask"]);

const $q = useQuasar();

const modulesStore = useModulesStore();
const groupStore = useGroupStore();

const taskData = ref({
  name: "",
  task_description: "",
  worker: "",
});

const workers = ref([]);

const createTaskHandler = () => {
  const newTask = {
    name: taskData.value.name,
    task_description: taskData.value.task_description,
    worker: taskData.value.worker,
    for_module: {
      name: props.module.name,
    },
  };

  modulesStore.addNewTask($q, props.module.id, newTask);
  taskData.value = {
    name: "",
    task_description: "",
    worker: "",
  };
};

onMounted(async () => {
  await modulesStore.fetchModules();
  const data = await groupStore.fetchMembers("2101692165904710833");

  workers.value = data.map((item) => {
    return {
      ...item,
      select_name: item.fullname.first_name + " " + item.fullname.last_name,
    };
  });
});
</script>

<style scoped>
.create-task-form {
  display: flex;
  width: 100vw;
}
</style>
