<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-toolbar-title>
          Пример пользовательского интерфейса приложения
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
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
  font-size: 1.2em !important; /* Увеличенный размер шрифта для текста уведомления */
  font-weight: bold !important; /* Жирный текст */
  padding: 10px !important; /* Отступы вокруг текста */
}
</style>
