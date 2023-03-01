<template>
  <div>
    <el-container class="main-class">
      <el-aside :width="'asideWidth'+'px'" style="background-color: #545c64; color: #fff">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          :default-active="activePath"
          unique-opened
          router
          :collapse-transition="true"
          :collapse="!isCollapse"
          active-text-color="#ffd04b">
          <span>
            <el-menu-item index="5" v-if="!isCollapse">
            <i class="el-icon-search"></i>
            <span slot="title">
              <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="inputSearch"
                clearable>
              </el-input>
            </span>
          </el-menu-item>
            <el-input
              class="searchInput"
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model="inputSearch"
              v-if="isCollapse"
              clearable>
          </el-input>
          </span>
          <el-submenu :index="parentMenu.path" v-for="(parentMenu, index) in menus" :key="index">
            <template slot="title">
              <v-icon :name="parentMenu.icon" scale="1.5" class="menu-icon"/>
              <span>{{ parentMenu.title }}</span>
            </template>
            <el-menu-item :index="children.path" v-for="(children, i) in parentMenu.children" :key="i" @click="savePath(children.path)">
              <template>
                <v-icon :name="children.icon" scale="1.2" class="menu-icon"/>
                <span>{{ children.title }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="background-color: #545c64; color: #fff">
          <el-row :gutter="20" type="flex" align="middle">
            <el-col :span="1">
              <span :class="collapseBtnClass" style="cursor: pointer;font-size: 20px;color: darkorange"
                    @click="collapse"></span>
            </el-col>
            <el-col :span="18">
              <div class="title">
                个人健康管理平台
              </div>
            </el-col>
            <el-col :span="2" style="text-align: right">
              <el-avatar :size="50" icon="el-icon-user-solid" :src="avatar"/>
            </el-col>
            <el-col :span="3" class="logout">
              <el-button type="info" @click="logout">退出登录</el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in $router.currentRoute.matched" :key="index">{{
                item.meta.title
              }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <router-view/>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "home",
  // vue计算属性
  computed: {
    ...mapState(["username", "avatar", "menus"])
  },
  created() {
    // 更新名字
    this.name = this.username;
    // console.log("菜单", this.menus)
  },
  data() {
    return {
      isCollapse: true,
      collapseBtnClass: 'el-icon-s-fold',
      asideWidth: 200,
      inputSearch: "",
      activePath: sessionStorage.getItem("activePath")
    }
  },
  methods: {
    savePath(path) {
      sessionStorage.setItem("activePath", path);
      this.activePath = path;
    },
    collapse() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse) {
        this.collapseBtnClass = 'el-icon-s-fold';
        this.asideWidth = 64;
      } else {
        this.collapseBtnClass = 'el-icon-s-unfold';
        this.asideWidth = 200;
      }
    },
    logout() {
      this.$confirm("是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 调用后端的退出接口 清除后端的登录信息
        this.$ajax.get("user/logout").then((res) => {
          //清空本地的登录信息
          console.log(res);
          sessionStorage.clear();
          // 跳转到登录页面
          this.$router.replace("/login");
          this.$message.success(res.msg);
        })
      }).catch(() => {

      });
    },
  }
}
</script>

<style scoped>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.title {
  text-align: left;
  font-size: 24px;
  font-family: 微软雅黑;
}

.logout {
  text-align: right;
}

.el-row {
  margin-bottom: 20px;
  height: 100%;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.searchInput {
  line-height: 60px;
  width: 180px;
}

.el-submenu .el-menu-item {
  padding-right: 15px;
}

</style>