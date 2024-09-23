<template>
  <q-page class="main-page">
    <div class="row full-height">
      <!-- Левая панель с деревом страниц и кнопкой Выйти -->
      <div class="col-3 page-tree q-pa-md">
        <!-- Большая красная кнопка Выйти -->
        <div class="logout-container q-mb-md">
          <q-btn
            label="Выйти"
            color="red"
            size="lg"
            @click="logout"
            class="full-width"
          />
        </div>

        <!-- Дерево страниц -->
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

      <!-- Правая панель с контентом выбранной страницы -->
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
import { useRouter } from "vue-router"; // Импортируем роутер для перенаправления

// Получаем роутер
const router = useRouter();

// Данные страниц
const pages = ref([
  { id: 1, title: "Главная", content: "Это главная страница." },
  { id: 2, title: "О нас", content: "Информация о компании." },
  { id: 3, title: "Контакты", content: "Свяжитесь с нами." },
]);

// Текущая выбранная страница
const selectedPage = ref(null);

// Функция выбора страницы
const selectPage = (page) => {
  selectedPage.value = page;
};

// Функция выхода
const logout = () => {
  // Удаляем токен из localStorage
  localStorage.removeItem("access_token");

  // Перенаправляем пользователя на страницу входа
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

/* Стили для кнопки Выйти */
.logout-container {
  margin-bottom: 20px; /* Отступ снизу */
}

.full-width {
  width: 100%;
}
</style>
