import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/LoginView.vue";
import MainView from "@/views/MainView.vue";
import GroupMembersView from "@/views/groups/GroupMembersView.vue";
import ModulesView from "@/views/modules/ModulesView.vue";
import TasksView from "@/views/tasks/TasksView.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/main",
    name: "main",
    component: MainView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/groups/:groupId",
    name: "group",
    component: GroupMembersView,
    props: true,
  },
  {
    path: "/modules",
    name: "modules",
    component: ModulesView,
  },
  {
    path: "/tasks",
    name: "tasks",
    component: TasksView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("access_token");
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
