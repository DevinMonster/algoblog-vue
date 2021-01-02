<template>
  <div>
    <Header></Header>
    <div class="blog_detail">
      <h2>{{ blog.title}}</h2>
      <div>发布时间：{{ blog.createTime }}</div>
      <div>作者：{{ blog.userName }}</div>
      <el-link v-if="myBlog" icon="el-icon-edit">
        <router-link :to="{name: 'Edit', params: {blogId: blog.id}}">
          编辑
        </router-link>
      </el-link>
      <el-divider><i class="el-icon-coffee-cup"></i></el-divider>
      <div class="content markdown-body" v-html="blog.content"></div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
// 然后添加样式markdown-body
import 'github-markdown-css/github-markdown.css';

export default {
  name: "BlogDetail",
  components: {
    Header
  },
  data() {
    return {
      blog: {
        id: '',
        title: '标题',
        content: '内容',
        createTime: '这是创建时间',
        userName: '用户名',
      },
      myBlog: false,
    }
  },
  methods: {
    logUser(id, that) {
      that.$axios.get(
          '/getUser/' + id
      ).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data;
          that.blog.userName = data.username;
        }
      })
    },

  },
  created() {
    let blogId = this.$route.params.blogId;
    if (blogId) {
      const that = this;
      this.$axios.get(
          '/blog/detail/' + blogId
      ).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data;
          that.blog.id = data.id;
          that.logUser(data.userId, that);
          that.blog.title = data.title;
          that.blog.createTime = data.createTime;
          // 渲染成markdown格式
          let MarkdownIt = require("markdown-it");
          let md = new MarkdownIt();
          that.blog.content = md.render(data.content);
          // 是否是自己的博客
          that.myBlog = data.userId === this.$store.getters.getUser.id;
        }
      })
    }
  }
}
</script>

<style scoped>
  /*背景阴影*/
  .blog_detail{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: 100%;
    min-height: 700px;
    padding: 20px 15px;
  }
</style>