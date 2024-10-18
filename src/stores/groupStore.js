import { defineStore } from "pinia";
import { getGroupMembers, inviteUser, getAllSpaceGroups } from "@/api";

export const useGroupStore = defineStore("group", {
  state: () => ({
    allSpaceGroups: [],
    selectedGroup: {},
    members: [],
  }),

  actions: {
    async fetchAllSpaceGroups() {
      this.allSpaceGroups = await getAllSpaceGroups();
    },

    async fetchMembers(groupId) {
      this.members = await getGroupMembers(groupId);
      return this.members;
    },

    initializeGroup(groupId) {
      if (groupId && this.allSpaceGroups.length > 0) {
        this.selectedGroup = this.allSpaceGroups.find(
          (group) => group.id === groupId
        );
        if (this.selectedGroup) {
          this.fetchMembers(this.selectedGroup.id);
        }
      }
    },

    async handleInviteUser(input) {
      const { status } = await inviteUser(input);
      if (status === 200) {
        alert("Пользователь успешно приглашен!");
      } else {
        alert("Не удалось пригласить пользователя.");
      }
    },
  },
});
