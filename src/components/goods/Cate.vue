<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="showAddCateDialog"
          >添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        border
        :show-row-hover="false"
        show-index
        index-text="#"
      >
        <!-- 是否有效 -->
        <template
          slot="isok"
          slot-scope="scope"
        >
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted===false"
            style="color:aquamarine;"
          ></i>
          <i
            class="el-icon-error"
            v-else
            style="color:lightcoral;"
          ></i>
        </template>

        <!-- 排序 -->
        <template
          slot="order"
          slot-scope="scope"
        >
          <el-tag
            size="mini"
            v-if="scope.row.cat_level===0"
          >一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level===1"
          >二级</el-tag>
          <el-tag
            type="warning"
            size="mini"
            v-else
          >三级</el-tag>
        </template>

        <!-- 操作 -->
        <template
          slot="oprate"
          slot-scope="scope"
        >
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加商品分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item
          label="分类名称:"
          prop="cat_name"
        >
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addCate"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 3
      },
      //商品分类数据列表，默认为空
      cateList: [],
      // 数据总条数
      total: 0,
      // 指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '分类名称',
          //意思是 将当前列定义为模板列
          type: 'template',
          //意思是  当前列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          //意思是 将当前列定义为模板列
          type: 'template',
          //意思是  当前列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          //意思是 将当前列定义为模板列
          type: 'template',
          //意思是  当前列使用的模板名称
          template: 'oprate'
        }
      ],
      // 添加商品对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类表单的数据对象
      addCateForm: {
        //将要添加分类的名称
        cat_name: '',
        //父级分类的id
        cat_pid: 0,
        //分类的等级,默认1级
        cat_level: 0
      },
      // 添加商品表单验证规则
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入商品分类名称', trigger: 'blur' }]
      },
      // 商品父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps:{
        expandTrigger: 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children',
        checkStrictly:true
      },
      // 选中的父级分类的id数组
      selectKeys:[]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }

      this.cateList = res.data.result
      // 为总条数赋值
      this.total = res.data.total
    },
    //监听页码的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //监听页码的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击展示 添加商品对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败!')
      }
      this.parentCateList = res.data
      console.log(this.parentCateList)

    },
    // 选择项发生变化
    parentCateChanged(){
      console.log(this.selectKeys);
      //如果 selectKeys 数组的length大于0，证明选中了父级分类
      //否则，没有选中任何父级分类
      if(this.selectKeys.length>0){
        //父级分类的id
        this.addCateForm.cat_pid=this.selectKeys[this.selectKeys.length - 1]
        //为当前分类的等级赋值
        this.addCateForm.cat_level=this.selectKeys.length
      return
      }else{
        // 父级分类的id，
        this.addCateForm.cat_pid=0
        this.addCateForm.cat_level=0
      }
      
    },
    //点击按钮添加新的分类
    addCate(){
      this.$refs.addCateFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res}=await this.$http.post('categories',this.addCateForm)
        console.log(res);
        if(res.meta.status!==201){
          return this.$message.error('添加失败')
        }

        this.$message.success('添加成功')
        this.getCateList()
        this.addCateDialogVisible=false
      })
    },
    //监听关闭添加对象对话框，重置表单
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys=[]
      this.addCateForm.cat_pid=0
      this.addCateForm.cat_level=0
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}

.el-cascader{
  width: 100%;
}
</style>