import store from "@/store";
import Vue from "vue";

/**
 * 自定义指令
 * 第一个参数是指令
 * 第二个参数是实现方法
 */
Vue.directive("hasRole", {
  inserted(el, binding) {
    // 获取指令传递过来的数据
    const {value} = binding;
    // 获取vuex 中的角色信息
    const roles = store.state.roles;
    // 定义超级管理员可以查看所有
    const admin = "SUPER_ADMIN";
    // 判断指令是否传值 传递的值是否是一个数组 数组是否大于0
    if (value && value instanceof Array && value.length > 0) {
      /**
       * some() 用于检测数组中的元素是否满足指定的条件 并不会改变原来的数组
       */
      const hasRole = roles.some(item => {
        return item.code === admin || value.includes(item.code);
      });
      if (!hasRole) {
        // 把对应的元素删除
        el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`请设置${value}角色标签`);
    }
  }
})

/**
 * 自定义权限指令
 */
Vue.directive("hasPermission", {
  inserted(el, binding) {
    const value = binding;
    // 获取权限数据
    const permissions = store.state.permissions;
    // 再获取用户角色
    const roles = store.state.roles;
    // 定义超级管理员可以查看所有
    const admin = "SUPER_ADMIN";
    // 判断值是否存在
    if (value && value instanceof Array && value.length > 0) {
      // 是否为管理员
      const hasRole = roles.some(item => {
        return item.code === admin;
      })
      // 如果不是管理员是否拥有对应权限
      const hasPermission = permissions.some(item => {
        return value.includes(item.code);
      });

      if (!hasPermission && !hasRole) {
        // 把对应的元素删除
        el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`请设置${value}权限标签`);
    }
  }
})
