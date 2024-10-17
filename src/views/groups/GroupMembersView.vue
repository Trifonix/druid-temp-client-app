<template>
  <PageLayout class="group-members-page">
    <InviteUserForm
      :selectedGroup="selectedGroup"
      @inviteUser="handleInviteUser"
    />

    <h3>{{ selectedGroup.name }}</h3>
    <h5>{{ selectedGroup.id }}</h5>

    <q-table
      v-if="members.length > 0"
      :rows="members"
      :columns="columns"
      row-key="id"
    />

    <div v-else>
      <h6>Кажется, в этой группе нет участников...</h6>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

import InviteUserForm from "@/components/InviteUserForm.vue";
import PageLayout from "@/components/PageLayout.vue";

import { getGroupMembers, inviteUser, getAllSpaceGroups } from "@/api";

const route = useRoute();
const groupId = ref(route.params.groupId);

const allSpaceGroups = ref([]);
const selectedGroup = ref({});

const members = ref([]);

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

const fetchAllSpaceGroups = async () => {
  allSpaceGroups.value = await getAllSpaceGroups();
};

const fetchMembers = async (groupId) => {
  members.value = await getGroupMembers(groupId);
};

const initializeGroup = () => {
  if (groupId.value && allSpaceGroups.value.length > 0) {
    selectedGroup.value = allSpaceGroups.value.find(
      (group) => group.id === groupId.value
    );
    if (selectedGroup.value) {
      fetchMembers(selectedGroup.value.id);
    }
  }
};

onMounted(async () => {
  await fetchAllSpaceGroups();
  initializeGroup();
});

watch(
  () => route.params.groupId,
  (newGroupId) => {
    groupId.value = newGroupId;
    initializeGroup();
  }
);

const handleInviteUser = async (input) => {
  const { status } = await inviteUser(input);
  if (status === 200) {
    alert("Пользователь успешно приглашен!");
  } else {
    alert("Не удалось пригласить пользователя.");
  }
};
</script>

<style scoped>
.group-members-page {
  padding: 20px;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
}
</style>
