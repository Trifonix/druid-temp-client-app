<template>
  <q-page class="page-layout">
    <NavigationTree />

    <div class="content q-pa-md">
      <slot></slot>
    </div>
  </q-page>
</template>

<script setup>
import NavigationTree from "./NavigationTree.vue";
</script>

<style scoped>
.page-layout {
  display: flex;
  min-height: 100vh;
}

.content {
  flex: 1;
}
</style>
