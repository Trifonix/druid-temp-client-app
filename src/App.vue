<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-toolbar-title>
          Система по ведению проекта | Модули и Задачи
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
export default {
  name: "App",
};
</script>

<style>
.custom-notify {
  font-size: 1.2em !important;
  font-weight: bold !important;
  padding: 10px !important;
}
</style>
