<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-toolbar-title>
          Система по ведению проекта "Строительство медицинского центра" | г.
          Москва
        </q-toolbar-title>

        <div>Druid</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import { onMounted } from "vue";

// import { useAuthStore } from "@/stores/authStore";

// const authStore = useAuthStore();

export default {
  name: "App",
};

// onMounted(async () => {
//   await authStore.fetchUser();
//   console.log(authStore.user);
// });
</script>

<style>
.custom-notify {
  font-size: 1.2em !important;
  font-weight: bold !important;
  padding: 10px !important;
}
</style>
