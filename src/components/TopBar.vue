<template>
  <div id="top">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1" @click="go('/index')">天线宝宝母婴商城首页</el-menu-item>
      <el-submenu index="2">
        <template slot="title">商家信息</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
        <el-menu-item index="2-4">选项3</el-menu-item>
      </el-submenu>
      <el-menu-item index="3" @click="go('/cart')">购物车</el-menu-item>
      <el-menu-item index="4" @click="go('/order')">我的订单</el-menu-item>
      <el-menu-item
        align="right"
        index="5"
        v-if="!isLogin"
        @click="go('/login')"
        >登录</el-menu-item
      >
      <el-submenu align="right" index="5" v-else>
        <template slot="title">{{ userName }}</template>
        <el-menu-item index="5-1" @click="loginout">注销</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: "1",
      isLogin: false,
      userName: "",
      cartsNum: 0
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let user = this.$getSessionStorage("user");
      if (user == null) {
        this.isLogin = false;
      } else {
        this.isLogin = true;
        this.userName = user.userName;
      }
      //获取购物车数据
      this.$axios
        .post(
          "cart/listbyuser",
          this.$qs.stringify({
            userId: user.userId
          })
        )
        .then(response => {
          let carts = response.data;
          // console.log(carts);

          this.cartsNum = carts.length;
          this.$setSessionStorage("carts", response.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSelect(key) {
      console.log(key);
    },
    go(path) {
      this.$router.push({ path });
    },
    loginout() {
      this.$removeSessionStorage("user");
      this.isLogin = false;
      this.$router.push({ path: "/index" });
    },
  },
};
</script>
<style scoped>
.el-menu-demo {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
}
.mark {
  margin-bottom: 5px;
}
</style>
