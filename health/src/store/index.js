import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: sessionStorage.getItem("token") || '',
    username: sessionStorage.getItem("username") || '',
    avatar: sessionStorage.getItem("avatar") || '',
    roles: [],
    menus: [],
    permissions: [],
  },
  getters: {},
  mutations: {
    setToken(state, data) {
      state.token = data;
      sessionStorage.setItem("token", data);
    },
    setUsername(state, data) {
      state.username = data;
    },
    setAvatar(state, data) {
      state.avatar = data;
    },
    setRoles(state, data) {
      state.roles = data;
    },
    setMenus(state, data) {
      state.menus = data;
    },
    setPermissions(state, data) {
      state.permissions = data;
    },
  },
  actions: {},
  modules: {},
});
