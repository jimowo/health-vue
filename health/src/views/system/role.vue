<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入角色信息"
            v-model="queryInfo.queryString"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              title="查询角色"
              @click="findPage"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button
            class="web-button"
            type="primary"
            @click="insertFormVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="80"> </el-table-column>
        <el-table-column prop="label" label="角色标签"></el-table-column>
        <el-table-column prop="code" label="角色码"> </el-table-column>
        <el-table-column label="权限" prop="permissions">
          <template slot-scope="scope">
            <el-popover placement="right" width="400" trigger="hover">
              <el-table :data="scope.row.permissions">
                <el-table-column
                  width="100"
                  property="label"
                  label="权限标签"
                ></el-table-column>
              </el-table>
              <el-button slot="reference">查看</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="menus" label="菜单">
          <template slot-scope="scope">
            <el-popover placement="right" width="400" trigger="hover">
              <el-tree
                :data="scope.row.menus"
                :props="{ label: 'title' }"
              ></el-tree>
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
              @click="deleterole(scope.row.id)"
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
      title="添加角色"
      :visible.sync="insertFormVisible"
      @close="dialogClose"
    >
      <el-form :model="insertForm" ref="insertForm" :rules="rules">
        <el-form-item
          label="角色标签"
          :label-width="formLabelWidth"
          prop="label"
        >
          <el-input v-model="insertForm.label" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="insertForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="权限"
          :label-width="formLabelWidth"
          prop="permissions"
        >
          <el-select
            v-model="insertForm.permissions"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择需要绑定的权限"
          >
            <el-option
              v-for="item in permissionOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单" :label-width="formLabelWidth" prop="menus">
          <el-cascader
            :options="menuOptions"
            :props="{
              multiple: true,
              checkStrictly: true,
              value: 'id',
              label: 'title',
              emitPath: false,
            }"
            clearable
            :show-all-levels="false"
            placeholder="请选择需要绑定的菜单"
            v-model="insertForm.menus"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.title }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertrole">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改角色"
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
        <el-form-item
          label="角色标签"
          :label-width="formLabelWidth"
          prop="label"
        >
          <el-input v-model="updateForm.label" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="updateForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="权限"
          :label-width="formLabelWidth"
          prop="permissions"
        >
          <el-select
            v-model="updateForm.permissions"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择需要绑定的权限"
          >
            <el-option
              v-for="item in permissionOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单" :label-width="formLabelWidth" prop="menus">
          <el-cascader
            :options="menuOptions"
            :props="{
              multiple: true,
              checkStrictly: true,
              value: 'id',
              label: 'title',
              emitPath: false,
            }"
            clearable
            :show-all-levels="false"
            placeholder="请选择需要绑定的菜单"
            v-model="updateForm.menus"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.title }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
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
    ...mapState(["menus", "permissions"]),
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
        label: "",
        code: "",
        menus: [],
        permissions: [],
      },
      updateForm: {
        id: "",
        label: "",
        code: "",
        menus: [],
        permissions: [],
      },
      menuOptions: [],
      permissionOptions: [],
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
    this.menuOptions = this.menus;
    this.permissionOptions = this.permissions;
  },
  methods: {
    /**
     * 分页查询请求
     */
    findPage() {
      this.$ajax.post("/role/findPage", this.queryInfo).then((res) => {
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
        this.$ajax.post("/role/insert", this.insertForm).then((res) => {
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
      this.updateForm.label = row.label;
      this.updateForm.code = row.code;
      this.updateForm.menus = [];
      this.updateForm.permissions = [];
      if (row.menus != null && row.menus.length > 0)
      {
        row.menus.forEach(element => {
          this.updateForm.menus.push(element.id);
          if (element.children != null && element.children.length > 0) {
            element.children.forEach(childMenu => {
              this.updateForm.menus.push(childMenu.id);
            })
          }
        });
      }
      if (row.permissions != null && row.permissions.length > 0)
      {
        row.permissions.forEach(element => {
          this.updateForm.permissions.push(element.id);
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
        this.$ajax.put("/role/update", this.updateForm).then((res) => {
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
    deleterole(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$ajax.delete(`/role/delete/${id}`).then((res) => {
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