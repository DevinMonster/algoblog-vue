<template>
  <div>
    <!--  统一头部  -->
    <Header :testId="'2'"></Header>
    <div class="content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <mavon-editor v-model="ruleForm.content"></mavon-editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";

export default {
  name: "Edit",
  components: {
    Header
  },
  data() {
    return {
      ruleForm: {
        id: '',
        userId: '',
        title: '',
        description: '',
        content: '',
      },
      rules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'},
          {min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '简介不能为空！', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '内容不能为空！', trigger: 'change'}
        ],
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this;
          this.$axios.post(
              "/blog/editOrAdd",
              that.ruleForm,
              {
                headers: {
                  "Authorization": localStorage.getItem("token"),
                }
              }
          ).then(res => {
            if (res.data.code === 200) {
              that.gotoBlogs(that);
            }
          })
        }
        else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    gotoBlogs(that) {
      that.$alert('操作成功', '成功', {
        confirmButtonText: '确定',
        callback: action => {
          that.$router.push('/blogs');
        }
      });
    },
  },
  created() {
    // 加载页面时如果有博客id那么就代表这是修改文章
    if (this.$store.getters.getUser)
      this.ruleForm.userId = this.$store.getters.getUser.id;
    // console.log(this.$store.getters.getUser);
    let blogId = this.$route.params.blogId;
    if (blogId) {
      const that = this;
      this.$axios.get(
          '/blog/detail/' + blogId
      ).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data;
          if (data.userId !== that.ruleForm.userId) {
            // console.log(data.userId);
            // console.log(this.ruleForm.userId);
            that.$notify.error({
              title: '错误',
              message: '您无权修改该博客！'
            });
            that.$router.push('/blogs');
          }
          that.ruleForm.id = data.id;
          that.ruleForm.title = data.title;
          that.ruleForm.description = data.description;
          that.ruleForm.content = data.content;
        }
      })
    }
  }
}
</script>

<style scoped>
.content {
  padding-top: 30px;
  text-align: center;
}
</style>