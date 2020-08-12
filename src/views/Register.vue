<template>
  <div>
    <TopBar></TopBar>
    <el-form
      :model="registerForm"
      status-icon
      ref="registerForm"
      label-width="100px"
      class="registerForm"
    >
      <el-form-item>注册</el-form-item>
      <el-form-item label="手机号" prop="userId">
        <el-input type="text" @blur="checkUserId" v-model="registerForm.userId" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="registerForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkpassword">
        <el-input type="password" v-model="registerForm.checkpassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="userName">
        <el-input type="text" v-model="registerForm.userName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="userSex">
        <el-radio-group v-model="registerForm.userSex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('registerForm')">提交</el-button>
        <el-button @click="resetForm('registerForm')">重置</el-button>
        <el-button @click="toLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import TopBar from "@/components/TopBar.vue";
export default {
  data() {
    return {
      registerForm: {
        userId: "",
        password: "",
        userName: "",
        userSex: 1,
        checkpassword: ""
      }
    };
  },
  methods: {
    checkUserId() {
      this.$axios
        .post(
          "user/isexistuser",
          this.$qs.stringify({ userId: this.registerForm.userId })
        )
        .then(res => {
          if (res.data == 1) {
            this.$message.error("用户名已存在");
          } else {
            this.$message.success("用户名可以使用");
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    submitForm(formName) { // eslint-disable-line no-unused-vars
      if (this.registerForm.userId == "") {
        this.$message.error("用户名不能为空");
        return;
      }
      if (this.registerForm.password == "") {
        this.$message.error("密码不能为空");
        return;
      }
      if (
        this.registerForm.password != "" &&
        this.registerForm.checkpassword != this.registerForm.password
      ) {
        this.$message.error("两次输入密码不一致");
        return;
      }
      this.$axios
        .post("user/insert", this.$qs.stringify(this.registerForm))
        .then(res => {
          if (res.data > 0) {
            this.$message.success("注册成功");
            this.$router.push({ path: "/login" });
          } else {
            this.$message.success("注册失败");
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toLogin() {
      this.$router.push({ path: "/login" });
    }
  },
  components: {
    TopBar
  }
};
</script>
<style scoped>
.registerForm {
  margin: 100px auto 20px;
  width: 40%;
}
</style>