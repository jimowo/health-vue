<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入权限信息"
            v-model="queryInfo.queryString"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              title="查询权限"
              @click="findPage"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button
            class="web-button"
            type="primary"
            v-hasPermission="['PERMISSION_INSERT']"
            @click="insertFormVisible = true"
            >添加权限</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
        <el-table-column type="index" width="80"> </el-table-column>
        <el-table-column prop="label" label="标签"></el-table-column>
        <el-table-column prop="code" label="代码"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="update(scope.row)" type="text" size="small" v-hasPermission="['PERMISSION_UPDATE']"
              >修改</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="deletePermission(scope.row.id)" v-hasPermission="['PERMISSION_DELETE']"
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
      title="添加权限"
      :visible.sync="insertFormVisible"
      @close="dialogClose"
    >
      <el-form :model="insertForm" ref="insertForm" :rules="rules">
        <el-form-item label="权限名" :label-width="formLabelWidth" prop="label">
          <el-input v-model="insertForm.label" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="insertForm.code" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertPermission">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改权限"
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
        <el-form-item label="权限名" :label-width="formLabelWidth" prop="label">
          <el-input v-model="updateForm.label" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="updateForm.code" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePermission">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "permission",
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
      loading: false,
      insertFormVisible: false,
      updateFormVisible: false,
      insertForm: {
        label: "",
        code: "",
      },
      updateForm: {
        id: "",
        label: "",
        code: "",
      },
      formLabelWidth: "120px",
      rules: {
        label: [
          { required: true, message: "请输入权限名", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "权限标签的长度位1-50之间",
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "请输入权限码", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "权限标签的长度位1-20之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.findPage();
  },
  methods: {
    /**
     * 分页查询请求
     */
    findPage() {
      this.loading = true;
      this.$ajax.post("/permission/findPage", this.queryInfo).then((res) => {
        this.tableData = res.rows;
        this.totalPage = res.total;
        this.loading = false;
      }).catch((err) => {
        this.loading = false;
        this.$message.warning("页面信息获取失败", err.msg);
      });
    },
    /**
     * 添加权限信息
     */
    insertPermission() {
      this.$refs.insertForm.validate((valid) => {
        // 校验不通过
        if (!valid) return this.$message.error("提交信息不合法 检查后提交");
        this.$ajax.post("/permission/insert", this.insertForm).then((res) => {
          this.$message.success(res.msg);
          this.findPage();
        });
      });
    },
    /**
     * 权限信息修改事件
     * @param {数据} row
     */
    update(row) {
      this.updateForm.id = row.id;
      this.updateForm.label = row.label;
      this.updateForm.code = row.code;
      this.updateFormVisible = true;
    },
    updatePermission() {
      this.$refs.updateForm.validate((valid) => {
        // 校验不通过
        if (!valid) return this.$message.error("提交信息不合法 检查后提交");
        this.$ajax.put("/permission/update", this.updateForm).then((res) => {
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
    deletePermission(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$ajax.delete(`/permission/delete/${id}`).then((res) => {
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