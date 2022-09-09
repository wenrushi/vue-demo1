<template>
  <div>Home组件
    <el-button @click="logout" type="info" round>退出</el-button>
  </div>
</template>

<script>
export default {


  methods:{
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style>

</style>