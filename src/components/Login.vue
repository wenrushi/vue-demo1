<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img
          src="../assets/屏幕截图 2022-09-09 094831.png"
          alt=""
        >
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-search" ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button @click="login" type="primary" round>登入</el-button>
          <el-button @click="resetForm('loginFormRef')" type="info" round>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      //这是数据表单绑定的对象
      loginForm:{
        username:'admin',
        password:'123456'
      },
      //表单验证规则
      rules:{
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods:{
    resetForm(loginFormRef) {
      this.$refs[loginFormRef].resetFields();
    },
    login(){
      this.$refs.loginFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res}=await this.$http.post('login', this.loginForm)
        console.log(res);
        if(res.meta.status!==200) return this.$message.error('登入失败')
        this.$message.success('登入成功')
        //登入成功后把token值保存到sessionStorage中,并且发生页面的跳转
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #9fcfff;
  height: 100%;
}
.login_box {
  position: relative;
  width: 500px;
  height: 350px;
  border-radius: 50px;
  background: #9fcfff;
  box-shadow: 35px 35px 70px #87b0d9, -35px -35px 70px #b7eeff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 35px 35px 70px #87b0d9, -35px -35px 70px #b7eeff;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #87b0d9;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #fff;
    }
  }
}

.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns{
  display: flex;
  justify-content: flex-end;
}
</style>

