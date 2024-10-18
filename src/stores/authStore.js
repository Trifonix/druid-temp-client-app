import { defineStore } from "pinia";
import { Notify } from "quasar";
import { userSignIn, getMyUserData } from "@/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || {},
    isAuth: !!localStorage.getItem("access_token"),
    loading: false,
    email: "",
    password: "",
  }),

  getters: {
    isAuthenticated: (state) => state.isAuth,
    isLoading: (state) => state.loading,
  },

  actions: {
    async fetchUser() {
      this.user = await getMyUserData();
      localStorage.setItem("user", JSON.stringify(this.user));
    },

    async login() {
      if (!this.email || !this.password) return;

      this.loading = true;

      try {
        const data = await userSignIn({
          login: this.email,
          password: this.password,
        });

        if (data && data.userSignIn) {
          const token = data.userSignIn.record.access_token;
          const space = 1795;
          localStorage.setItem("access_token", token);
          localStorage.setItem("space", space);
          this.isAuth = true;

          await this.fetchUser();

          Notify.create({
            message: `Добро пожаловать!`,
            color: "positive",
            icon: "check_circle",
            position: "top",
            timeout: 2000,
            classes: "custom-notify",
          });

          return "OK";
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
        this.isAuth = false;
        if (localStorage.getItem("access_token"))
          localStorage.removeItem("access_token");
      } finally {
        this.loading = false;
      }
    },

    logout() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("space");
      localStorage.removeItem("user");
      this.isAuth = false;
      this.user = {};
    },

    checkAuth() {
      const token = localStorage.getItem("access_token");
      this.isAuth = !!token;

      if (this.isAuth) {
        this.fetchUser();
      }
    },
  },
});
