<template>
  <div>
    <div class="form-class">
      <el-card>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="50px"
        >
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="ruleForm.mail" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              :loading="load"
              >提交</el-button
            >
            <el-button
              type="normal"
              @click="returnLogin()"
              >返回</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "forget",
  data() {
    return {
      ruleForm: {
        mail: "",
      },
      rules: {
        mail: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },
      load: false,
    };
  },
  methods: {
    submitForm: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.load = true;
          console.log(this.ruleForm.mail);
          this.$ajax
            .get(`/mail/forgetPwd/${this.ruleForm.mail}`)
            .then((res) => {
              this.$message.success(res.msg);
              this.load = false;
            })
            .catch((err) => {
              this.load = false;
              this.$message.warning("该邮箱不存在");
            });
        } else {
          this.$message.error("邮箱不合法 检查后提交");
          return false;
        }
      });
    },
    /**
     * 返回登录页面
     */
    returnLogin() {
      this.$router.push("/login");
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
  