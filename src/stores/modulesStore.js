import { defineStore } from "pinia";
import {
  getModules,
  deleteModule,
  createModule,
  getModule,
  createTask,
} from "@/api";
import { date } from "quasar";

export const useModulesStore = defineStore("modules", {
  state: () => ({
    modules: [],
  }),

  actions: {
    async fetchModules() {
      this.modules = await getModules();
    },

    async fetchModule(moduleId) {
      this.modules.push(await getModule(moduleId));
    },

    getModuleById(moduleId) {
      return this.modules.find((module) => module.id === moduleId) || null;
    },

    deleteModuleHandler(moduleId, $q) {
      return new Promise((resolve) => {
        $q.dialog({
          title: "Подтверждение",
          message: "Вы уверены, что хотите удалить этот модуль?",
          ok: {
            label: "Да",
            color: "negative",
          },
          cancel: {
            label: "Нет",
            color: "primary",
          },
          persistent: true,
        })
          .onOk(async () => {
            try {
              const { status } = await deleteModule(moduleId);
              if (status === 204) {
                this.modules = this.modules.filter(
                  (module) => module.id !== moduleId
                );
                $q.notify({
                  type: "positive",
                  message: "Модуль успешно удален",
                });
                resolve(true);
              } else {
                $q.notify({
                  type: "negative",
                  message: "Ошибка при удалении модуля",
                });
                resolve(false);
              }
            } catch (error) {
              console.error("Ошибка при удалении модуля:", error);
              $q.notify({
                type: "negative",
                message: "Ошибка при удалении модуля",
              });
              resolve(false);
            }
          })
          .onCancel(() => {
            $q.notify({
              type: "info",
              message: "Удаление модуля отменено",
            });
            resolve(false);
          });
      });
    },

    async addNewModule($q, newModule) {
      const lastModuleNumber = Math.max(
        ...this.modules.map((module) => {
          const match = module.module_name.match(/Тест (\d+)/);
          return match ? parseInt(match[1]) : 0;
        }),
        0
      );
      const newModuleNumber = lastModuleNumber + 1;

      const input = {
        name: `Тестовый модуль ${newModuleNumber}`,
        module_name: newModule.module_name,
        answerable: {
          "4186684371488381928": {
            objectId: newModule.answerable.id,
          },
        },
        start_date: newModule.start_date,
        end_date: newModule.end_date,
      };

      try {
        const { status, record } = await createModule(input);
        if (status === 200) {
          const newModule = {
            id: record.id,
            module_name: record.module_name,
            start_date: record.start_date,
            end_date: record.end_date,
            answerable: null,
            tasks: [],
          };
          this.modules = [...this.modules, newModule];
          $q.notify({
            type: "positive",
            message: "Модуль успешно создан!",
          });
        } else {
          $q.notify({
            type: "negative",
            message: "Не удалось создать модуль.",
          });
        }
      } catch (error) {
        console.error("Ошибка при создании модуля:", error);
        $q.notify({
          type: "negative",
          message: "Ошибка при создании модуля",
        });
      }
    },

    async addNewTask($q, moduleId, newTask) {
      const input = {
        name: newTask.name,
        task_description: newTask.task_description,
        worker: newTask.worker,
        for_module: {
          object: {
            id: moduleId,
            name: newTask.for_module.name,
          },
        },
      };

      console.log(input);

      try {
        const { status, record } = await createTask(input);
        if (status === 200) {
          const module = this.modules.find((module) => module.id === moduleId);
          if (module) {
            module.tasks.push(record);
            $q.notify({
              type: "positive",
              message: "Задача успешно создана!",
            });
          } else {
            $q.notify({
              type: "negative",
              message: "Модуль не найден.",
            });
          }
        } else {
          $q.notify({
            type: "negative",
            message: "Не удалось создать задачу.",
          });
        }
      } catch (error) {
        console.error("Ошибка при создании задачи:", error);
        $q.notify({
          type: "negative",
          message: "Ошибка при создании задачи",
        });
      }
    },
  },
});
