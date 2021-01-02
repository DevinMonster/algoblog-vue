<template>
  <div>
    <!--  标题区  -->
    <div class="center">
      <h3>欢迎来到我的算法博客</h3>
    </div>
    <!--  导航栏  -->
    <el-menu :default-active="this.testId" class="center el-menu-demo" mode="horizontal">
      <el-menu-item index="1"><el-link href="/blogs">首页</el-link></el-menu-item>
      <el-menu-item index="2"><el-link href="/blog/add">发表博客</el-link></el-menu-item>
      <el-menu-item index="3" v-if="hasLogin"><el-link @click="logout">退出登录</el-link></el-menu-item>
      <el-menu-item index="4" v-else><el-link href="/login">登录</el-link></el-menu-item>
      <el-menu-item index="5" v-if="!hasLogin"><el-link href="/register">没有账号?注册一个</el-link></el-menu-item>
      <div>
        <span>{{ user.username }}</span>&nbsp;
        <el-avatar :src="user.avatar" icon="el-icon-user-solid"></el-avatar>
      </div>
    </el-menu>
    <!--  用户信息  -->
<!--     class="block" style="text-align: right; margin-right: 100px" -->



  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      user: {
        username: '请登录',
        avatar: ''
      },
      hasLogin: false,
    }
  },
  props: [
      'testId',
  ],
  methods: {
    logout() {
      let that = this;
      this.$axios.get("/logout", {
        headers: {
          "Authorization": localStorage.getItem("token"),
        }
      }).then(res => {
        that.$store.commit("REMOVE_INFO");
        that.hasLogin = false;
        that.$notify({
          title: '退出',
          message: that.user.username + '成功退出.',
          position: 'top-left'
        });
        that.$router.push("/login");
      })
    },
  },
  created() {
    if (this.$store.getters.getUser && this.$store.getters.getUser.username) {
      this.user.username = this.$store.getters.getUser.username;
      this.user.avatar = this.$store.getters.getUser.avatar;
      this.hasLogin = true;
    }
  }
}
</script>

<style scoped>
  .center{
    max-width: 960px; margin: 0 auto; text-align: center;
  }
</style>