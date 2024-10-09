<template>
  <q-page class="main-page">
    <div class="row full-height">
      <div class="col-3 page-tree q-pa-md">
        <div class="logout-container q-mb-md">
          <q-btn
            label="Выйти"
            color="red"
            size="lg"
            @click="logout"
            class="full-width"
          />
        </div>

        <q-list bordered>
          <q-item
            clickable
            v-for="page in pages"
            :key="page.id"
            @click="selectPage(page)"
          >
            <q-item-section>
              <q-item-label>{{ page.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col q-pa-md">
        <q-card>
          <q-card-section>
            <div v-if="selectedPage">
              <h3>{{ selectedPage.title }}</h3>
              <p>{{ selectedPage.content }}</p>
            </div>
            <div v-else>
              <h3>Выберите страницу из дерева</h3>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const pages = ref([
  { id: 1, title: "Главная", content: "Это главная страница." },
  { id: 2, title: "О нас", content: "Информация о компании." },
  { id: 3, title: "Контакты", content: "Свяжитесь с нами." },
]);

const selectedPage = ref(null);

const selectPage = (page) => {
  selectedPage.value = page;
};

const logout = () => {
  localStorage.removeItem("access_token");
  router.push({ name: "login" });
};
</script>

<style scoped>
.main-page {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  min-height: 100vh;
}
.full-height {
  height: 100%;
}
.page-tree {
  border-right: 3px dotted #bbb;
  border-radius: 24px;
}
.logout-container {
  margin-bottom: 20px;
}
.full-width {
  width: 100%;
}
</style>
