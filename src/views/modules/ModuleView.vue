<template>
  <PageLayout class="module-page">
    <div v-if="module">{{ module }}</div>
    <!-- <h3>{{ selectedGroup.name }}</h3>

    <q-table
      v-if="members.length > 0"
      :rows="members"
      :columns="columns"
      row-key="id"
    />

    <div v-else>
      <h6>Кажется, в этой группе нет участников...</h6>
    </div> -->
  </PageLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import PageLayout from "@/components/PageLayout.vue";

import { getModule } from "@/api";

const route = useRoute();
const moduleId = ref(route.params.moduleId);

const module = ref({});

onMounted(() => {
  module.value = getModule(moduleId.value);
});
</script>

<style scoped>
.module-page {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
}
</style>
