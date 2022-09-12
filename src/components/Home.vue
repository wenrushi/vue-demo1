<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div class="header_left">
        <img
          src="../assets/logo.png"
          alt=""
        >
        <span>电商后台管理系统</span>
      </div>
      <el-button
        @click="logout"
        type="info"
        round
      >退出</el-button>
    </el-header>
    <!-- 内容 -->
    <el-container>
      <!-- 左侧 -->
      <el-aside :width="isCollapse? '64px':'200px'">
        <div
          class="toggle-button"
          @click="toggleCollapse"
        >|||</div>
        <!-- 左侧菜单区域 -->
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#313743"
          text-color="#fff"
          active-text-color="#3797FE"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <el-submenu
            :index="item.id+''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: '',
      icons: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-grid',
        101: 'el-icon-shopping-bag-1',
        102: 'el-icon-tickets',
        145: 'el-icon-loading'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    //点击按钮，切换菜单的折叠和展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath=activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #2f3235;
  color: #fff;
  text-align: center;
  line-height: 60px;
  font-size: 25px;

  .header_left {
    height: 100%;
    display: flex;
    align-items: center;
    img {
      height: 100%;
    }
  }
}

.el-aside {
  background-color: #313743;
  color: #fff;
  line-height: 200px;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #e9edf1;
  color: #fff;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  font-weight: bold;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>