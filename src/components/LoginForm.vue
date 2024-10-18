<template>
  <q-card class="q-pa-md login-card" v-if="!authStore.isAuthenticated">
    <q-card-section class="row items-center q-gutter-sm justify-center">
      <div class="col text-center">
        <div class="login-title">Вход в систему</div>
      </div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="authHandler()">
        <q-input
          v-model="authStore.email"
          label="Email"
          type="email"
          filled
          class="q-mb-md input-field"
          :rules="[(val) => !!val || 'Пожалуйста, введите email']"
          required
        />
        <q-input
          v-model="authStore.password"
          label="Пароль"
          type="password"
          filled
          class="q-mb-md input-field"
          :rules="[(val) => !!val || 'Пожалуйста, введите пароль']"
          required
        />
        <q-btn
          type="submit"
          label="Задруидиться"
          color="primary"
          class="full-width"
          :loading="authStore.isLoading"
        />
      </q-form>
    </q-card-section>
  </q-card>

  <q-card class="q-pa-md login-card" v-else>
    <q-card-section class="row items-center q-gutter-sm justify-center">
      <q-btn
        label="Вернуться"
        color="primary"
        class="full-width"
        @click="router.push('/')"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const router = useRouter();

const authStore = useAuthStore();

const authHandler = async () => {
  const response = await authStore.login();

  if (response instanceof Error) {
    console.log("ошибка авторизации");
  } else {
    router.push("/");
  }
};

onMounted(() => {
  authStore.checkAuth();
});
</script>

<style scoped>
.login-card {
  width: 400px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  padding: 20px;
}

.login-title {
  font-size: 2em;
  font-weight: bold;
  color: #3f51b5;
  margin-bottom: 20px;
}

.full-width {
  width: 100%;
}

.input-field {
  --q-color-primary: #3f51b5;
  --q-input-padding: 12px;
  border-radius: 8px;
  font-size: 1.2em;
}

.q-btn {
  font-size: 1.2em;
  padding: 12px;
}
</style>
