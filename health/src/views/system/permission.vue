<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="6">
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
        <el-col :span="8">
          <el-button-group>
            <el-button class="web-button" type="info" @click="insertPermission"
              >添加权限</el-button
            >
            <el-button
              class="web-button"
              type="warning"
              @click="updatePermission"
              >修改权限</el-button
            >
            <el-button
              class="web-button"
              type="danger"
              @click="deletePermission"
              >删除权限</el-button
            >
          </el-button-group>
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="主键" width="180"> </el-table-column>
        <el-table-column prop="label" label="标签" width="180">
        </el-table-column>
        <el-table-column prop="code" label="代码"> </el-table-column>
      </el-table>
      <div class="block">
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
      </div>
    </el-card>
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
      this.$ajax.post("/permission/findPage", this.queryInfo).then((res) => {
        this.tableData = res.rows;
        this.totalPage = res.total;
      });
    },
    insertPermission() {},
    updatePermission() {},
    deletePermission() {},
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