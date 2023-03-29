<template>
  <div>
    <div class="form-class">
      <el-card>
        <el-image style="width: 100px; height: 100px" :src="url"></el-image>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="50px"
        >
          <el-form-item label="账号" prop="username">
            <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              :loading="load"
              >用户登录</el-button
            >
            <el-button @click="resetForm('ruleForm')">清空表格</el-button>
            <el-button type="warning" @click="forgetPwd()">忘记密码</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "login",
  data() {
    const checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
      callback();
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入密码"));
      }
      callback();
    };
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ validator: checkUsername, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
      url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      load: false,
    };
  },
  methods: {
    submitForm: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.load = true;
          this.$ajax.post("/user/login", this.ruleForm).then((res) => {
            // 如果数据校验成功 则向后端发送请求 进行登录
            this.load = false;
            const tokenBody = res.data;
            let tokenHead = tokenBody.tokenHead;
            let token = tokenBody.token;
            this.$store.commit("setToken", tokenHead + token);
            // 跳转主页
            this.$router.push("/");
            this.$message.success(res.msg);
          }).catch((err) => {
            this.load = false;
            this.$message.warning("用户名或密码错误");
          });
        } else {
          this.$message.error("用户名或密码不合法 检查后提交");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /**
     * 忘记密码
     */
    forgetPwd() {
      this.$router.push("/forget");
    },
  },
};
</script>

<style scoped>
.form-class {
  width: 40%;
  margin: 10% 35% 30%;
  text-align: center;
}
</style>
