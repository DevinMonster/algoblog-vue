<template>
  <el-container>
    <el-header>
      <img class="logo"
           src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2934753909,4028498487&fm=26&gp=0.jpg" alt="">
    </el-header>
    <el-main>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verifyCode">
          <el-input v-model="ruleForm.verifyCode" style="float: left"></el-input>
          <div class="verifyCode" style="float: left; width: 122px;">
            <img src="" ref="code" @click="refreshCode" alt="">
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>

  </el-container>

</template>

<style>
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

    var validateVerifyCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      }
      callback();
    };

    return {
      ruleForm: {
        username: 'admin',
        password: 'a123456',
        verifyCode: '',
        key: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 4, max: 30, message: '用户名长度在4-30位', trigger: 'blur'},
          {validator: checkUsername, trigger: 'blur'}
        ],
        password: [
          {min: 6, message: '密码由6位以上的数字字母下划线组成', trigger: 'blur'},
          {validator: validatePass, trigger: 'blur'}
        ],
        verifyCode: [
          {validator: validateVerifyCode, trigger: 'blur'}
        ],
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
              '/login',
              this.ruleForm,
          ).then(res => {
            let code = res.data.code;
            // console.log(res);
            if (code === 200) {
              let message = that.getMessage(new Date().getHours());
              // console.log("hour: " + hour);
              let userInfo = res.data.data;
              let jwt = res.headers['authorization'];
              that.$store.commit("SET_TOKEN", jwt);
              that.$store.commit("SET_USER_INFO", userInfo);
              // 消息提醒
              that.$notify({
                title: '欢迎',
                // here
                message: '欢迎: ' + userInfo.username + ', ' + message,
                position: 'top-left'
              });
              that.$router.push("/blogs");
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    refreshCode() {
      // console.log(url);
      const that = this;
      this.$axios.get("/user/code?id=" + Math.random()).then(res => {
        // console.log(res.data.data);
        // 唯一后台验证的值
        if (res.data !== null && res.data.data.key !== null && res.data.data.encoded !== null) {
          that.ruleForm.key = res.data.data.key;
          that.$refs['code'].setAttribute("src", res.data.data.encoded);
        } else {
          that.refreshCode();
        }
      })
    },
    getMessage(hour) {
      if (hour >= 18) return "晚上好！";
      if (hour >= 12) return "下午好！";
      if (hour < 6) return "凌晨了，早点休息吧~"
      return "早上好！";
    }
  },
  created() {
    this.refreshCode();
  }
}
</script>

