import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/login";
import Home from "@/views/home"
import Forget from "@/views/forget"
import store from "@/store";
import ajax from "@/utils/ajax";
import { formatMenu } from "@/utils/initMenus";

Vue.use(VueRouter);

const routes = [{
        path: "/login",
        component: Login,
    },
    {
        path: "/",
        component: Home,
    },
    {
        path: "/forget",
        component: Forget,
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
    console.log(router);
    // 用户是否登录
    const token = sessionStorage.getItem("token");
    if (!token) {
        if (to.path === "/login" || to.path === "/forget") {
            next();
        } else {
            next(`/login?redirect=${to.fullPath}`);
        }
    } else {
        // 判断vuex 中是否存在用户基本信息
        // 向后端发送请求 获取用户的基本信息
        ajax.get("/user/getInfo").then((res) => {
            // 把用户信息复制到本地缓存
            const user = res.data;
            store.commit("setAvatar", user.avatar);
            store.commit("setUsername", user.username);
            if (user.roles.length > 0) {
                // 添加角色信息
                store.commit("setRoles", user.roles);
                // 添加菜单信息
                const menuList = formatMenu(user.menus);
                for (let menu of menuList) {
                    router.addRoute(menu);
                }
                store.commit("setMenus", menuList);
                // 添加权限信息
                store.commit("setPermissions", user.permissions);
            }
        });
        // 已经登录跳转主页
        if (to.path === "/login") {
            next("/");
        } else {
            next();
        }
    }
});

export default router;