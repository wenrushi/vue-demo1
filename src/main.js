import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局css样式
import './assets/css/global.css'
import treeTable from 'vue-table-with-tree-grid'

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'


import axios from 'axios'
//配置axios

axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization=window.sessionStorage.getItem('token')
  //固定写法
  return config;
})
Vue.prototype.$http=axios

Vue.config.productionTip = false



Vue.component('tree-table',treeTable)

Vue.use(VueQuillEditor)

//注册全局过滤器
//第一个参数是过滤器的名字，第二个参数是过滤器的处理函数
//originVal为需要处理的时间
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal);
  //分别得到年、月、日、时、分、秒
  const y = dt.getFullYear();//年
  //  月是从0开始的，需要让他+1
  //希望月份不足两位，在前面补0，先加个''，让它变成字符串，再调用padStart(2,'0')
  //第一个参数表示，一共多少位，第二个表示不足多少位用什么补足
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')//月
  const d = (dt.getDate() + '').padStart(2, '0')//日

  const hh = (dt.getHours() + '').padStart(2, '0');//时
  const mm = (dt.getMinutes() + '').padStart(2, '0');//分
  const ss = (dt.getSeconds() + '').padStart(2, '0');//秒

  // return `yyyy-mm-dd hh:mm:ss`
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`



})







new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
