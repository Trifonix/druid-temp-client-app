<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-toolbar-title>
          Система по ведению проекта "Строительство медицинского центра" | г.
          Москва
        </q-toolbar-title>

        <div v-if="authStore.isAuthenticated">
          {{ authStore.user.userMy.name }} {{ authStore.user.userMy.surname }}
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { watchEffect } from "vue";
import { useAuthStore } from "@/stores/authStore";
const authStore = useAuthStore();
watchEffect(authStore);
</script>

<style>
.custom-notify {
  font-size: 1.2em !important;
  font-weight: bold !important;
  padding: 10px !important;
}
</style>
