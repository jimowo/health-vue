import Home from "@/views/home"

/**
 * 格式化菜单 将菜单转换为主键
 * @param {array} menus 传入的菜单信息
 */
export const formatMenu = (menus) => {
  // 迭代菜单
  const route = menus.filter(item => {
    item.component = (item.component === "home") ? Home : loadView(item.component);
    item.meta = {
      title: item.title
    }
    // 处理子菜单
    if (item.children && item.children.length > 0) {
      formatMenu(item.children);
    }
    return true;
  });
  // 将格式化后的信息进行返回
  return route;
}

/**
 * 路由懒加载
 * @param view
 * @returns {function(*): any}
 */
const loadView = (view) => {
  return (resolve) => require([`@/views/${view}.vue`], resolve);
}