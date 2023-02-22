<template>

  <div>用户管理
    <el-button v-hasRole="['ADMIN', 'USER_DELETE']">删除用户</el-button>
    <el-button v-hasPermission="['ADMIN', 'USER_INSERT']">添加用户</el-button>
  </div>



</template>

<script>
export default {
  name: "user",
  data() {
    return {
    }
  },
  computed: {
  },
  created() {
  }
}
</script>

<style scoped>

</style>