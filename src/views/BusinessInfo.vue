<template>
  <div class="wrapper">
    <TopBar ref="top"></TopBar>
    <ul class="shop">
      <li v-for="(f, index) in shopArr" :key="index">
        <div class="shop-left">
          <img :src="f.shopImg" />
          <div class="shop-left-info">
            <h3>{{ f.shopName }}</h3>
            <p>{{ f.shopExplain }}</p>
            <p>&#165;{{ f.shopPrice }}</p>
          </div>
        </div>
        <div class="shop-right">
          <div>
            <i
              class="fa fa-minus-circle"
              @click="minus(index)"
              v-show="f.quantity != 0"
            ></i>
          </div>
          <p>
            <span v-show="f.quantity != 0">{{ f.quantity }}</span>
          </p>
          <div>
            <i class="fa fa-plus-circle" @click="add(index)"></i>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue";
export default {
  data() {
    return {
      businessId: this.$route.query.businessId,
      shopArr: [],
      user: {},
    };
  },
  mounted() {
    this.$refs.top.activeIndex = "2";
    this.user = this.$getSessionStorage("user");
    this.initShopList();
  },
  methods: {
    initShopList() {
      this.$axios
        .post(
          "shop/list",
          this.$qs.stringify({
            businessId: this.businessId,
          })
        )
        .then((response) => {
          this.shopArr = response.data;
          for (let i = 0; i < this.shopArr.length; i++) {
            this.shopArr[i].quantity = 0;
          }

          //如果已登录，那么去查询购物车中是否已经有食品了，如果有，要将数量显示出来
          if (this.user != null) {
            this.listCart();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    listCart() {
      //获取购物车数据
      this.$axios
        .post(
          "cart/listbyuser",
          this.$qs.stringify({
            userId: this.user.userId,
          })
        )
        .then((response) => {
          let cartArr = response.data;
          //遍历所有食品
          for (let shopItem of this.shopArr) {
            //给每一个商家添加一个数量属性，默认为0
            shopItem.quantity = 0;
            //遍历当前用户的购物车
            for (let cartItem of cartArr) {
              //判断当前用户购物车中是否有当前商家的食品，如果有，就把数量加上
              if (cartItem.shopId == shopItem.shopId) {
                shopItem.quantity += cartItem.quantity;
              }
            }
          }
          this.shopArr.sort();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    add(index) {
      //首先做登录验证
      if (this.user == null) {
        this.$router.push({ path: "/login" });
        return;
      }

      if (this.shopArr[index].quantity == 0) {
        //做insert
        this.saveCart(index);
      } else {
        //做update
        this.updateCart(index, 1);
      }
      this.$refs.top.init();
    },
    minus(index) {
      //首先做登录验证
      if (this.user == null) {
        this.$router.push({ path: "/login" });
        return;
      }

      if (this.shopArr[index].quantity > 1) {
        //做update
        this.updateCart(index, -1);
      } else {
        //做delete
        this.removeCart(index);
      }
    },
    saveCart(index) {
      this.$axios
        .post(
          "cart/insert",
          this.$qs.stringify({
            userId: this.user.userId,
            businessId: this.businessId,
            shopId: this.shopArr[index].shopId,
            quantity: 1,
          })
        )
        .then((response) => {
          if (response.data == 1) {
            //购物车表中添加一条食品记录，那么这条食品记录的数量要变成1
            this.shopArr[index].quantity = 1;
            //这里不是想要排序，而是通过变异方法，让vue监控到数组的变化
            this.shopArr.sort();
            this.$refs.top.init();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateCart(index, num) {
      this.$axios
        .post(
          "cart/updatequantity",
          this.$qs.stringify({
            userId: this.user.userId,
            businessId: this.businessId,
            shopId: this.shopArr[index].shopId,
            quantity: this.shopArr[index].quantity + num,
          })
        )
        .then((response) => {
          if (response.data == 1) {
            //购物车表中添加一条食品记录，那么这条食品记录的数量要变成1
            this.shopArr[index].quantity += num;
            //这里不是想要排序，而是通过变异方法，让vue监控到数组的变化
            this.shopArr.sort();
            this.$refs.top.init();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    removeCart(index) {
      this.$axios
        .post(
          "cart/delete",
          this.$qs.stringify({
            userId: this.user.userId,
            businessId: this.businessId,
            shopId: this.shopArr[index].shopId,
          })
        )
        .then((response) => {
          if (response.data == 1) {
            //购物车表删除了这条食品记录，那么这条食品记录的数量要变成0
            this.shopArr[index].quantity = 0;
            this.shopArr.sort();
            this.$refs.top.init();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  components: {
    TopBar,
  },
};
</script>
<style scoped>
/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100%;
}

/****************** 列表部分 ******************/
.wrapper .shop {
  width: 70%;
  /*使用下外边距避开footer部分*/
  margin-top: 50px;
  margin-bottom: 24px;
}
.wrapper .shop li {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  user-select: none;

  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wrapper .shop li .shop-left {
  display: flex;
  align-items: center;
}
.wrapper .shop li .shop-left img {
  width: 130px;
  height: 130px;
}
.wrapper .shop li .shop-left .shop-left-info {
  margin-left: 20px;
}
.wrapper .shop li .shop-left .shop-left-info h3 {
  font-size: 26px;
  color: #555;
}
.wrapper .shop li .shop-left .shop-left-info p {
  font-size: 20px;
  color: #888;
  margin-top: 2px;
}
.wrapper .shop li .shop-right {
  width: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wrapper .shop li .shop-right .fa-minus-circle {
  font-size: 32px;
  color: #999;
  cursor: pointer;
}
.wrapper .shop li .shop-right p {
  font-size: 28px;
  color: #333;
  margin: 0 20px;
}
.wrapper .shop li .shop-right .fa-plus-circle {
  font-size: 32px;
  color: #0097ef;
  cursor: pointer;
}

/****************** 购物车部分 ******************/
.wrapper .cart {
  width: 100%;
  height: 14px;

  position: fixed;
  left: 0;
  bottom: 0;

  display: flex;
}
.wrapper .cart .cart-left {
  flex: 2;
  background-color: #505051;
  display: flex;
}
.wrapper .cart .cart-left .cart-left-icon {
  width: 16px;
  height: 16px;
  box-sizing: border-box;
  border: solid 1.6px #444;
  border-radius: 8px;
  background-color: #3190e8;
  font-size: 7px;
  color: #fff;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: -4px;
  margin-left: 3px;

  position: relative;
}
.wrapper .cart .cart-left .cart-left-icon-quantity {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: red;
  color: #fff;
  font-size: 14px;

  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  right: -10px;
  top: -10px;
}
.wrapper .cart .cart-left .cart-left-info p:first-child {
  font-size: 14px;
  color: #fff;
  margin-top: 24px;
}
.wrapper .cart .cart-left .cart-left-info p:last-child {
  font-size: 2.8px;
  color: #aaa;
}

.wrapper .cart .cart-right {
  flex: 1;
}
/*达到起送费时的样式*/
.wrapper .cart .cart-right .cart-right-item {
  width: 100%;
  height: 100%;
  background-color: #38ca73;
  color: #fff;
  font-size: 4.5px;
  font-weight: 700;
  user-select: none;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
