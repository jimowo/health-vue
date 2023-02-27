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
              title="查询菜单"
              @click="findPage"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button
            class="web-button"
            type="primary"
            @click="insertFormVisible = true"
            >添加菜单</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="主键" width="80"> </el-table-column>
        <el-table-column prop="path" label="路由"></el-table-column>
        <el-table-column prop="icon" label="图标"> </el-table-column>
        <el-table-column prop="title" label="名称"> </el-table-column>
        <el-table-column prop="component" label="组件"> </el-table-column>
        <el-table-column prop="parentId" label="父菜单"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="update(scope.row)" type="text" size="small"
              >修改</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="deleteMenu(scope.row.id)"
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
      title="添加菜单"
      :visible.sync="insertFormVisible"
      @close="dialogClose"
    >
      <el-form :model="insertForm" ref="insertForm" :rules="rules">
        <el-form-item label="路由" :label-width="formLabelWidth" prop="path">
          <el-input v-model="insertForm.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" :label-width="formLabelWidth" prop="icon">
          <el-input v-model="insertForm.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单名" :label-width="formLabelWidth" prop="title">
          <el-input v-model="insertForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="前端组件" :label-width="formLabelWidth" prop="component">
          <el-input v-model="insertForm.component" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父菜单id" :label-width="formLabelWidth" prop="parent_id">
          <el-input v-model="insertForm.parent_id" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertMenu">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改菜单限"
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
        <el-form-item label="路由" :label-width="formLabelWidth" prop="path">
          <el-input v-model="updateForm.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" :label-width="formLabelWidth" prop="icon">
          <el-input v-model="updateForm.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单名" :label-width="formLabelWidth" prop="title">
          <el-input v-model="updateForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="前端组件" :label-width="formLabelWidth" prop="component">
          <el-input v-model="updateForm.component" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父菜单id" :label-width="formLabelWidth" prop="parent_id">
          <el-input v-model="updateForm.parent_id" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "menu",
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
        path: "",
        icon: "",
        title: "",
        component: "",
        parent_id: "",
      },
      updateForm: {
        id: "",
        path: "",
        icon: "",
        title: "",
        component: "",
        parent_id: "",
      },
      formLabelWidth: "120px",
      rules: {
        path: [
          { required: true, message: "请输入路由", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "path的长度位1-100之间",
            trigger: "blur",
          },
        ],
        icon: [
          { required: true, message: "请输入图标", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "icon的长度位1-20之间",
            trigger: "blur",
          },
        ],
        title: [
          { required: true, message: "请输入菜单名", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "title的长度位1-20之间",
            trigger: "blur",
          },
        ],
        component: [
          { required: true, message: "请输入组件", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "component的长度位1-20之间",
            trigger: "blur",
          },
        ],
        parent_id: [
          { required: true, message: "请输入父级菜单id", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "parent_id的长度位1-20之间",
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
      this.$ajax.post("/menu/findPage", this.queryInfo).then((res) => {
        this.tableData = res.rows;
        this.totalPage = res.total;
      });
    },
    /**
     * 添加权限信息
     */
    insertMenu() {
      this.$refs.insertForm.validate((valid) => {
        // 校验不通过
        if (!valid) return this.$message.error("提交信息不合法 检查后提交");
        this.$ajax.post("/menu/insert", this.insertForm).then((res) => {
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
      this.updateForm.path = row.path;
      this.updateForm.icon = row.icon;
      this.updateForm.title = row.title;
      this.updateForm.component = row.component;
      this.updateForm.parent_id = row.parentId;
      this.updateFormVisible = true;
    },
    updateMenu() {
      this.$refs.updateForm.validate((valid) => {
        // 校验不通过
        if (!valid) return this.$message.error("提交信息不合法 检查后提交");
        this.$ajax.put("/menu/update", this.updateForm).then((res) => {
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
    deleteMenu(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$ajax.delete(`/menu/delete/${id}`).then((res) => {
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