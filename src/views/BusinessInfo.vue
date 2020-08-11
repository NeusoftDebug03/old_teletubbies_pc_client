<template>
  <div class="wrapper">
    <TopBar ref="top"></TopBar>
    <ul class="food">
      <li v-for="(f, index) in foodList" :key="index">
        <div class="food-left">
          <img :src="f.foodImg" />
          <div class="food-left-info">
            <h3>{{ f.foodName }}</h3>
            <p>{{ f.foodExplain }}</p>
            <p>&#165;{{ f.foodPrice }}</p>
          </div>
        </div>
        <div class="food-right">
          <!-- <div >
            <i class="fa fa-minus-circle"></i>
          </div>
          <p><span>3</span></p>-->
          <div>
            <i class="fa fa-plus-circle"></i>
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
      foodList: []
    };
  },
  mounted() {
    this.$refs.top.activeIndex = "2";
    // console.log(this.$route.query.businessid);
    this.$axios
      .post(
        "food/list",
        this.$qs.stringify({
          businessId: this.$route.query.businessId
        })
      )
      .then(response => {
        this.foodList = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  components: {
    TopBar
  }
};
</script>
<style scoped>
/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100%;
}

/****************** 食品列表部分 ******************/
.wrapper .food {
  width: 70%;
  /*使用下外边距避开footer部分*/
  margin-top: 50px;
  margin-bottom: 24px;
}
.wrapper .food li {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  user-select: none;

  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wrapper .food li .food-left {
  display: flex;
  align-items: center;
}
.wrapper .food li .food-left img {
  width: 130px;
  height: 130px;
}
.wrapper .food li .food-left .food-left-info {
  margin-left: 20px;
}
.wrapper .food li .food-left .food-left-info h3 {
  font-size: 26px;
  color: #555;
}
.wrapper .food li .food-left .food-left-info p {
  font-size: 20px;
  color: #888;
  margin-top: 2px;
}
.wrapper .food li .food-right {
  width: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wrapper .food li .food-right .fa-minus-circle {
  font-size: 18px;
  color: #999;
  cursor: pointer;
}
.wrapper .food li .food-right p {
  font-size: 16px;
  color: #333;
}
.wrapper .food li .food-right .fa-plus-circle {
  font-size: 18px;
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
