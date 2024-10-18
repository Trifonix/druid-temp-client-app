<template>
  <q-card class="q-pa-md login-card" v-if="!isAuth.value">
    <q-card-section class="row items-center q-gutter-sm justify-center">
      <div class="col text-center">
        <div class="login-title">Вход в систему</div>
      </div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="onLogin">
        <q-input
          v-model="email"
          label="Email"
          type="email"
          filled
          class="q-mb-md input-field"
          :rules="[(val) => !!val || 'Пожалуйста, введите email']"
          required
        />
        <q-input
          v-model="password"
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
          :loading="loading"
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
        @click="backToMainPage"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Notify } from "quasar";
import { useRouter } from "vue-router";
import { userSignIn } from "@/api";

const router = useRouter();
const loading = ref(false);

const email = ref("");
const password = ref("");

const isAuth = ref(false);

const onLogin = async () => {
  if (!email.value || !password.value) return;

  loading.value = true;

  try {
    const data = await userSignIn({
      login: email.value,
      password: password.value,
    });

    if (data && data.userSignIn) {
      const token = data.userSignIn.record.access_token;
      const space = 1795;
      localStorage.setItem("access_token", token);
      localStorage.setItem("space", space);
      isAuth.value = true;
      Notify.create({
        message: `Добро пожаловать!`,
        color: "positive",
        icon: "check_circle",
        position: "top",
        timeout: 2000,
        classes: "custom-notify",
      });

      router.push({ name: "main" });
    }
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    Notify.create({
      message: "Ошибка входа. Попробуйте снова.",
      color: "negative",
      icon: "error",
      position: "bottom",
      timeout: 2000,
      classes: "custom-notify",
    });
    isAuth.value = false;
    if (localStorage.getItem("access_token"))
      localStorage.removeItem("access_token");
  } finally {
    loading.value = false;
  }
};
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
