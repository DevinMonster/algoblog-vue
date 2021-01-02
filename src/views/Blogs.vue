<template>
  <div>
    <!--   统一导航栏   -->
    <Header :testId="'1'"></Header>
    <!--  内容信息  -->
    <div class="block">
      <el-timeline>
        <el-timeline-item :timestamp="blog.createTime" placement="top" v-for="blog in blogs.blogs" :key="blog.id">
          <el-card>
            <h4>
              <router-link :to="{name: 'BlogDetail', params: {blogId: blog.id}}">
                {{ blog.title }}
              </router-link>
            </h4>
            <p>{{ blog.description }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <!--  分页    -->
      <el-pagination class="pagination"
                     :page-count="blogs.page_count"
                     :current-page="blogs.currPage"
                     background
                     layout="prev, pager, next"
                     :total="blogs.total"
                     :page-size="blogs.page_size" @current-change=page>

      </el-pagination>
    </div>

  </div>
</template>

<script>
import Header from "../components/Header";

export default {
  name: "Blogs.vue",
  components: {
    Header
  },
  data() {
    return {
      blogs: {
        blogs: {}, // 博客们
        currPage: 1, // 当前页
        page_size: 5, // 每页显示条目数
        total: 0, //  总条目
      }
    }
  },
  methods: {
    page(currPage) {
      let that = this;
      this.$axios.get(
          "/blog/blogs?id=" + currPage + "&size=" + that.blogs.page_size,
      ).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          that.blogs.blogs = res.data.data.records;
          that.blogs.currPage = res.data.data.current;
          that.blogs.total = res.data.data.total;
          that.blogs.page_size = res.data.data.size;
        }
      })
    },
  },
  created() {
    this.page(this.blogs.currPage);
  }
}
</script>

<style scoped>
.block {
  padding-top: 30px;
}

.pagination{
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
}
</style>