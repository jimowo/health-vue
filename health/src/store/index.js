import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: sessionStorage.getItem("token") || '',
    username: sessionStorage.getItem("username") || '',
    avatar: sessionStorage.getItem("avatar") || '',
    roles: JSON.parse(sessionStorage.getItem("roles")),
    menus: JSON.parse(sessionStorage.getItem("menus")),
    permissions: JSON.parse(sessionStorage.getItem("permissions")),
  },
  getters: {},
  mutations: {
    setToken(state, data) {
      state.token = data;
      sessionStorage.setItem("token", data);
    },
    setUsername(state, data) {
      state.username = data;
      sessionStorage.setItem("username", data);
    },
    setAvatar(state, data) {
      state.avatar = data;
      sessionStorage.setItem("avatar", data);
    },
    setRoles(state, data) {
      state.roles = data;
      sessionStorage.setItem("roles", JSON.stringify(data));
    },
    setMenus(state, data) {
      state.menus = data;
      sessionStorage.setItem("menus", JSON.stringify(data));
    },
    setPermissions(state, data) {
      state.permissions = data;
      sessionStorage.setItem("permissions", JSON.stringify(data));
    },
  },
  actions: {},
  modules: {},
});
