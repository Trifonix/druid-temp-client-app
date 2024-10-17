<template>
  <div class="invite-form row items-center full-width">
    <q-input
      v-model="inviteData.name"
      label="Имя"
      class="col q-mr-sm"
      outlined
    />
    <q-input
      v-model="inviteData.surname"
      label="Фамилия"
      class="col q-mr-sm"
      outlined
    />
    <q-input
      v-model="inviteData.email"
      label="Email"
      class="col q-mr-sm"
      outlined
      type="email"
    />
    <q-btn
      label="Пригласить в эту группу"
      color="primary"
      @click="inviteUserHandler"
      class="q-mb-mt"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  selectedGroup: Object,
});

const emit = defineEmits(["inviteUser"]);

const inviteData = ref({ name: "", surname: "", email: "" });

const inviteUserHandler = () => {
  const user = {
    name: inviteData.value.name,
    surname: inviteData.value.surname,
    email: inviteData.value.email,
    group_id: props.selectedGroup.id,
  };

  emit("inviteUser", user);
};
</script>

<style scoped>
.invite-form {
  display: flex;
  width: 100vw;
}
</style>
