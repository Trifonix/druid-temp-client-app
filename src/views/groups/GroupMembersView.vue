<template>
  <PageLayout class="group-members-page">
    <InviteUserForm
      v-if="groupStore.selectedGroup.id"
      :selectedGroup="groupStore.selectedGroup"
      @inviteUser="groupStore.handleInviteUser"
    />

    <h3 v-if="groupStore.selectedGroup.name">
      {{ groupStore.selectedGroup.name }}
    </h3>

    <q-table
      v-if="groupStore.members.length > 0"
      :rows="groupStore.members"
      :columns="columns"
      row-key="id"
    />

    <div v-else>
      <h6>Кажется, в этой группе нет участников...</h6>
    </div>
  </PageLayout>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useGroupStore } from "@/stores/groupStore";

import InviteUserForm from "@/components/InviteUserForm.vue";
import PageLayout from "@/components/PageLayout.vue";

const route = useRoute();
const groupStore = useGroupStore();

const columns = [
  {
    name: "first_name",
    label: "First name",
    field: (row) => row.fullname.first_name,
    align: "left",
  },
  {
    name: "last_name",
    label: "Last name",
    field: (row) => row.fullname.last_name,
    align: "left",
  },
  {
    name: "email",
    label: "Email",
    field: (row) => row.email.email,
    align: "left",
  },
];

onMounted(async () => {
  await groupStore.fetchAllSpaceGroups();
  groupStore.initializeGroup(route.params.groupId);
});

watch(
  () => route.params.groupId,
  (newGroupId) => {
    groupStore.initializeGroup(newGroupId);
  }
);
</script>

<style scoped>
.group-members-page {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
}
</style>
