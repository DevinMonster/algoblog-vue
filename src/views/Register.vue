<template>
  <el-container>
    <el-header>
      <img class="logo"
           src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2934753909,4028498487&fm=26&gp=0.jpg" alt="">
    </el-header>
    <el-main>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" autocomplete="on"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="校验密码" prop="checkPassword">
          <el-input type="password" v-model="ruleForm.checkPassword" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
            prop="email"
            label="邮箱">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>

        <el-upload
            class="avatar-uploader"
            action="http://localhost:8081/qiniu/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
          <img v-if="ruleForm.avatar" :src="ruleForm.avatar" class="avatar" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>

  </el-container>

</template>

<style>
.upload-pic{
  float: right;
}

.demo-ruleForm {
  max-width: 500px;
  margin: 0 auto;
}

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  /*background-color: #E9EEF3;*/
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.logo {
  height: 100%;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<script>
export default {
  name: "Login",
  data() {
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'));
      } else callback();
      // 用户名由4到30位英文字母数字组成
      let reg = /^[A-Za-z0-9_]{4,30}$/;
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error('用户名由4到30位英文字母数字组成'));
        } else callback();
      }, 1000);
    };

    var validatePass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入密码'));
      } else {
        let reg = /^[A-Za-z]{1,}[A-Za-z0-9_]{5,}$/;
        if (!reg.test(value)) callback(new Error('密码由6位以上的数字字母下划线组成，且以大小写字母开头'));
      }
      callback();
    };

    var validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入校验密码'));
      } else {
        if (value !== this.ruleForm.password) return callback(new Error('校验密码与原密码不匹配'));
      }
      callback();
    };

    return {
      ruleForm: {
        username: '',
        password: '',
        checkPassword: '',
        email: '',
        avatar: '',
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 4, max: 30, message: '用户名长度在4-30位', trigger: 'blur'},
          {validator: checkUsername, trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, message: '密码由6位以上的数字字母下划线组成', trigger: 'blur'},
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPassword: [
          {required: true, message: '请输入校验密码', trigger: 'blur'},
          {min: 6, message: '密码由6位以上的数字字母下划线组成', trigger: 'blur'},
          {validator: validateCheckPass, trigger: 'blur'}
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      // alert(formName);
      this.$refs[formName].validate(valid => {
        if (valid) {
          const that = this;
          this.$axios.post(
              '/register',
              this.ruleForm,
          ).then(res => {
            let code = res.data.code;
            // console.log(res);
            if (code === 200) {
              // 消息提醒
              that.$notify({
                title: '成功',
                message: '注册成功',
                position: 'top-left'
              });
              that.$router.push("/login");
            } else {
              that.$notify({
                title: '失败',
                message: res.data.message,
                position: 'top-left'
              });
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 200) this.ruleForm.avatar = res.data;
    },
    beforeAvatarUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isLt5M;
    }
  }
}
</script>

