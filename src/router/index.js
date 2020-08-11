import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import BusinessList from "../views/BusinessList.vue";
import BusinessInfo from "../views/BusinessInfo.vue";
import Cart from "../views/Cart.vue";
// ... ...

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Index,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/index",
    name: "Index",
    // redirect: "/index/businessList",
    component: Index,
    // chirldren: [{ path: "/index/businessList", component: BusinessList }],
  },
  {
    path: "/businessList",
    name: "BusinessList",
    component: BusinessList,
  },
  {
    path: "/businessInfo",
    name: "BusinessInfo",
    component: BusinessInfo,
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
];

//解决重复路由报异常问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
