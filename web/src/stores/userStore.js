import { defineStore } from 'pinia';

export const useUserStore = defineStore("user", {
  state: () => ({
    id: 0,
    username: "",
    role: "",
  }),
  getters: {
    doubleCount: (state) => state.role,
  },
  actions: {
    setUser(user) {
      const {id, username, role} = user
      this.id = id
      this.username = username
      this.role = role
    },
  },
});
