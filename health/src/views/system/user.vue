<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入用户信息"
            v-model="queryInfo.queryString"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              title="查询用户"
              @click="findPage"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button
            class="web-button"
            type="primary"
            @click="insertFormVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="80"> </el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="nickname" label="昵称"> </el-table-column>
        <el-table-column prop="sex" label="性别"> </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
        <el-table-column prop="wxOpenid" label="微信ID"> </el-table-column>
        <el-table-column prop="status" label="状态"> 
          <template slot-scope="scope">
            {{ scope.row.status }}
          </template>
        </el-table-column>
        <el-table-column prop="admin" label="是否为管理员">
          <template slot-scope="scope">
            {{ scope.row.admin }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
        <el-table-column label="角色" prop="roles">
          <template slot-scope="scope">
            <el-popover placement="right" width="400" trigger="hover">
              <el-table :data="scope.row.roles">
                <el-table-column
                  width="100"
                  property="label"
                  label="角色标签"
                ></el-table-column>
              </el-table>
              <el-button slot="reference">查看</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="update(scope.row)" type="text" size="small"
              >修改</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="deleteUser(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="insertFormVisible"
      @close="dialogClose"
    >
      <el-form :model="insertForm" ref="insertForm" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="insertForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="insertForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickname">
          <el-input v-model="insertForm.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <template>
            <el-radio v-model="insertForm.sex" label="2">未知</el-radio>
            <el-radio v-model="insertForm.sex" label="0">男</el-radio>
            <el-radio v-model="insertForm.sex" label="1">女</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth" prop="avatar">
          <el-input v-model="insertForm.avatar" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信ID" :label-width="formLabelWidth" prop="wxOpenid">
          <el-input v-model="insertForm.wxOpenid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-switch v-model="insertForm.status" active-color="#13ce66" inactive-color="#ff4949"/>
        </el-form-item>
        <el-form-item label="是否管理员" :label-width="formLabelWidth" prop="admin">
          <el-switch v-model="insertForm.admin" active-color="#13ce66" inactive-color="#ff4949"/>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="insertForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="insertForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="角色"
          :label-width="formLabelWidth"
          prop="roles"
        >
          <el-select
            v-model="insertForm.roles"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择需要绑定的角色"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertrole">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改用户"
      :visible.sync="updateFormVisible"
      @close="dialogClose"
    >
      <el-form :model="updateForm" ref="updateForm" :rules="rules">
        <el-form-item label="主键" :label-width="formLabelWidth" prop="id">
          <el-input
            v-model="updateForm.id"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="updateForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="updateForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickname">
          <el-input v-model="updateForm.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <template>
            <el-radio v-model="updateForm.sex" label="2">未知</el-radio>
            <el-radio v-model="updateForm.sex" label="0">男</el-radio>
            <el-radio v-model="updateForm.sex" label="1">女</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth" prop="avatar">
          <el-input v-model="updateForm.avatar" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信ID" :label-width="formLabelWidth" prop="wxOpenid">
          <el-input v-model="updateForm.wxOpenid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-switch v-model="updateForm.status" active-color="#13ce66" inactive-color="#ff4949"/>
        </el-form-item>
        <el-form-item label="是否管理员" :label-width="formLabelWidth" prop="admin">
          <el-switch v-model="updateForm.admin" active-color="#13ce66" inactive-color="#ff4949"/>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="updateForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="updateForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="角色"
          :label-width="formLabelWidth"
          prop="roles"
        >
          <el-select
            v-model="updateForm.roles"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择需要绑定的角色"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  // vue计算属性
  computed: {
    ...mapState(["roles"]),
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      queryInfo: {
        pageNumber: 1,
        pageSize: 5,
        queryString: null,
      },
      insertFormVisible: false,
      updateFormVisible: false,
      insertForm: {
        username: "",
        password: "",
        nickname: "",
        sex: "",
        avatar: "",
        address: "",
        avatar: "",
        wxOpenid: "",
        status: "",
        admin: "",
        phone: "",
        email: "",
        roles: [],
      },
      updateForm: {
        id: "",
        username: "",
        password: "",
        nickname: "",
        sex: "",
        avatar: "",
        address: "",
        avatar: "",
        wxOpenid: "",
        status: "",
        admin: "",
        phone: "",
        email: "",
        roles: [],
      },
      roleOptions: [],
      formLabelWidth: "80px",
      rules: {
        code: [
          { required: true, message: "请输入角色码", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "path的长度位1-20之间",
            trigger: "blur",
          },
        ],
        label: [
          { required: true, message: "请输入角色标签", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "title的长度位1-50之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.findPage();
    this.roleOptions = this.roles;
  },
  methods: {
    /**
     * 分页查询请求
     */
    findPage() {
      this.$ajax.post("/user/findPage", this.queryInfo).then((res) => {
        this.tableData = res.rows;
        this.totalPage = res.total;
      });
    },
    /**
     * 添加权限信息
     */
    insertrole() {
      this.$refs.insertForm.validate((valid) => {
        // 校验不通过
        if (!valid) return this.$message.error("提交信息不合法 检查后提交");
        console.log("insertForm", this.insertForm);
        this.$ajax.post("/user/insert", this.insertForm).then((res) => {
          this.$message.success(res.msg);
          this.findPage();
        });
      });
    },
    /**
     * 权限信息修改事件 将原数据填入表单
     * @param {数据} row
     */
    update(row) {
      this.updateForm.id = row.id;
      this.updateForm.username = row.username;
      this.updateForm.password = row.password;
      this.updateForm.nickname = row.nickname;
      this.updateForm.sex = row.sex.toString();
      this.updateForm.avatar = row.avatar;
      this.updateForm.address = row.address;
      this.updateForm.wxOpenid = row.wxOpenid;
      this.updateForm.status = row.status;
      this.updateForm.admin = row.admin;
      this.updateForm.phone = row.phone;
      this.updateForm.email = row.email;
      this.updateForm.roles = [];
      if (row.roles != null && row.roles.length > 0)
      {
        row.roles.forEach(element => {
          this.updateForm.roles.push(element.id);
        });
      }
      this.updateFormVisible = true;
    },
    /**
     * 更新角色信息
     */
    updateRole() {
      this.$refs.updateForm.validate((valid) => {
        // 校验不通过
        if (!valid) return this.$message.error("提交信息不合法 检查后提交");
        this.$ajax.put("/user/update", this.updateForm).then((res) => {
          this.$message.success(res.msg);
          this.findPage();
          this.updateFormVisible = false;
        });
      });
    },
    /**
     * 权限信息删除事件
     * @param {删除的id} id
     */
    deleteUser(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$ajax.delete(`/user/delete/${id}`).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 刷新
            this.queryInfo.pageNumber = 1;
            this.currentPage = 1;
            this.findPage();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * 分页大小改变事件
     * @param {分页大小} val
     */
    handleSizeChange(val) {
      this.queryInfo.pageSize = val;
      this.findPage();
    },
    /**
     * 页码改变事件
     * @param {页码} val
     */
    handleCurrentChange(val) {
      this.queryInfo.pageNumber = val;
      this.findPage();
    },
    /**
     * 刷新表单
     */
    dialogClose() {
      if (this.$refs["insertForm"] !== undefined) {
        this.$refs["insertForm"].resetFields();
      }
      if (this.$refs["updateForm"] !== undefined) {
        this.$refs["updateForm"].resetFields();
      }
    },
  },
};
</script>

<style scoped>
.web-button {
  margin-left: 10px;
}
.el-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
}
</style>