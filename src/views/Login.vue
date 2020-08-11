<template>
  <div>
    <TopBar ref="top"></TopBar>
    <el-form :model="loginForm" status-icon ref="loginForm" label-width="100px" class="loginForm">
      <el-form-item>登录</el-form-item>
      <el-form-item label="手机号" prop="pass">
        <el-input type="text" v-model="loginForm.userId" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="checkPass">
        <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="resetForm('loginForm')">重置</el-button>
        <el-button @click="toRegist">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import TopBar from "@/components/TopBar.vue";
export default {
  data() {
    return {
      loginForm: {
        userId: "",
        password: ""
      }
    };
  },
  mounted() {
    this.$refs.top.activeIndex = "5";
  },
  methods: {
    submitForm() {
      if (this.loginForm.userId == "") {
        this.$message.error("用户名不能为空");
        return;
      }
      if (this.loginForm.password == "") {
        this.$message.error("密码不能为空");
        return;
      }
      //登录请求
      this.$axios
        .post("user/login", this.$qs.stringify(this.loginForm))
        .then(res => {
          let user = res.data;
          if (user == null || user == "") {
            this.$message.error("用户名或密码不正确");
            return false;
          } else {
            //缓存用户信息,清空图片缓存，数据量大有可能溢出，所以不要将图片放入SessionStorage中
            user.userImg = "";
            this.$setSessionStorage("user", user);
            this.$router.push({ path: "/index" });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toRegist() {
      this.$router.push({ path: "/register" });
    }
  },
  components: {
    TopBar
  }
};
</script>
<style scoped>
.loginForm {
  margin: 100px auto 20px;
  width: 40%;
}
</style>