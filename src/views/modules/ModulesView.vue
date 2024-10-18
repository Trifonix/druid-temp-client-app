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
      <q-select
        v-if="answerables.length > 0"
        v-model="newModule.answerable"
        :options="answerables"
        label="Ответственный"
        outlined
        class="col q-mr-sm"
        option-value="id"
        option-label="select_name"
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
import { useGroupStore } from "@/stores/groupStore";

import { useQuasar } from "quasar";

import PageLayout from "@/components/PageLayout.vue";

const modulesStore = useModulesStore();
const groupStore = useGroupStore();

const answerables = ref([]);

const $q = useQuasar();

const newModule = ref({
  module_name: "",
  start_date: "",
  end_date: "",
  answerable: "",
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

const deleteModuleHandler = async (moduleId) => {
  await modulesStore.deleteModuleHandler(moduleId, $q);
};

const addNewModule = () => {
  if (newModule.value.answerable) {
    const { select_name, ...answerableWithoutSelectName } =
      newModule.value.answerable;

    const formattedModule = {
      ...newModule.value,
      start_date: convertDateToServerFormat(newModule.value.start_date),
      end_date: convertDateToServerFormat(newModule.value.end_date),
      answerable: answerableWithoutSelectName,
    };

    console.log(formattedModule);

    modulesStore.addNewModule($q, formattedModule);
  } else {
    console.error("Selected answerable not found");
  }
};

const convertDateToServerFormat = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
};

onMounted(async () => {
  await modulesStore.fetchModules();
  const data = await groupStore.fetchMembers("2784767641474305072");

  answerables.value = data.map((item) => {
    return {
      ...item,
      select_name: item.fullname.first_name + " " + item.fullname.last_name,
    };
  });
});
</script>

<style scoped>
.modules-page {
  background: linear-gradient(115deg, #e8fdfa, #bfebe2);
}
</style>
