import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/login";
import Home from "@/views/home"
import welcome from "@/views/welcome";
import store from "@/store";
import ajax from "@/utils/ajax";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    children: [
      {
        path: "/home/welcome",
        component: welcome,
      },
    ]
  }
];

const router = new VueRouter({
  routes,
});

/**
 * 路由导航
 * to； 将要去哪个页面
 * from：从哪个页面过来
 * next: 放行到哪个页面
 */
router.beforeEach((to, from, next) => {
  // 用户是否登录
  const token = sessionStorage.getItem("token");
  if (!token) {
    if (to.path === "/login") {
      next();
    }
    next("/login");
  } else {
    if (to.path === "/") {
      next("/home")
    }
    next();
    // 判断vuex 中是否存在用户基本信息
    if (!store.state.roles || store.state.roles.length < 1) {
      // 向后端发送请求 获取用户的基本信息
      ajax.get("/user/getInfo").then((res) => {
        // 把用户信息复制到本地缓存
        const user = res.data;
        store.commit("setAvatar", user.avatar);
        store.commit("setUsername", user.username);
        if (user.roles.length > 0) {
          //添加角色 菜单 权限等信息
          store.commit("setRoles", user.roles)
          store.commit("setMenus", user.menus)
          store.commit("setPermissions", user.permissions)
        }
      });
    }
  }
});

export default router;
