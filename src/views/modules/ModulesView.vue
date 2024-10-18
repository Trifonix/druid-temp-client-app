<template>
  <PageLayout class="modules-page">
    <form class="row items-center full-width q-mb-sm">
      <q-input
        v-model="newModule.module_name"
        label="Название модуля"
        outlined
        class="col q-mr-sm"
        @keyup.enter="addNewModule"
      />
      <q-input
        v-model="newModule.start_date"
        label="Стартовая дата"
        mask="date"
        outlined
        class="col q-mr-sm"
        type="date"
      />
      <q-input
        v-model="newModule.end_date"
        label="Конечная дата"
        mask="date"
        outlined
        class="col q-mr-sm"
        type="date"
      />

      <q-btn
        label="Добавить модуль"
        color="primary"
        class="q-mb-mt"
        @click="addNewModule"
      />
    </form>

    <q-table
      :rows="modulesStore.modules"
      :columns="columnsForModuleTable"
      row-key="id"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>{{ props.row.module_name }}</q-td>
          <q-td>
            {{
              (props.row.answerable?.object?.fullname?.first_name || "") +
              " " +
              (props.row.answerable?.object?.fullname?.last_name || "")
            }}
          </q-td>
          <q-td>{{ props.row.start_date }}</q-td>
          <q-td>{{ props.row.end_date }}</q-td>
          <q-td>{{ props.row.tasks.length }}</q-td>
          <q-td>
            <q-btn
              color="red"
              label="Удалить модуль"
              @click="deleteModuleHandler(props.row.id)"
            ></q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </PageLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { useModulesStore } from "@/stores/modulesStore";
import { useQuasar } from "quasar";

import PageLayout from "@/components/PageLayout.vue";

const modulesStore = useModulesStore();
const $q = useQuasar();

const newModule = ref({
  module_name: "",
  start_date: "",
  end_date: "",
});

const columnsForModuleTable = [
  {
    name: "module_name",
    label: "Module name",
    field: "module_name",
    align: "left",
  },
  {
    name: "answerable",
    label: "Answerable",
    field: "answerable",
    align: "left",
  },
  {
    name: "start_date",
    label: "Start date",
    field: "start_date",
    align: "left",
  },
  { name: "end_date", label: "End date", field: "end_date", align: "left" },
  { name: "tasks", label: "Tasks", field: "tasks", align: "left" },
];

onMounted(() => {
  modulesStore.fetchModules();
});

const deleteModuleHandler = async (moduleId) => {
  await modulesStore.deleteModuleHandler(moduleId, $q);
};

const addNewModule = () => {
  const formattedModule = {
    ...newModule.value,
    start_date: convertDateToServerFormat(newModule.value.start_date),
    end_date: convertDateToServerFormat(newModule.value.end_date),
  };

  modulesStore.addNewModule($q, formattedModule);
};

const convertDateToServerFormat = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
};
</script>

<style scoped>
.modules-page {
  background: linear-gradient(115deg, #e8fdfa, #bfebe2);
}
</style>
