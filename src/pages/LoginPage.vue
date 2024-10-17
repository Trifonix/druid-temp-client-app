<template>
  <q-page class="flex flex-center page-background">
    <LoginForm />
  </q-page>
</template>

<script setup>
import LoginForm from "@/components/LoginForm.vue";
</script>

<style scoped>
.page-background {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  min-height: 100vh;
}
</style>
