<template>
  <div class="wrapper">
    <TopBar ref="top"></TopBar>
    <div class="address">
      <h5>订单配送至：</h5>
      <div class="address-info" @click="toUserAddress">
        <p>
          {{
          Object.keys(deliveryaddress).length > 0
          ? deliveryaddress.address
          : "请选择送货地址"
          }}
        </p>
        <i class="fa fa-angle-right"></i>
      </div>
      <p>{{ user.userName }}{{ user.userSex | sexFilter }} {{ user.userId }}</p>
    </div>
    <el-table :data="tableData" tooltip-effect="dark" style="margin:50px auto;">
      <el-table-column label="商品信息" width="350">
        <template slot-scope="scope">
          <img class="shopImg" :src="scope.row.shop.shopImg" alt />
          <span class="shopName">{{ scope.row.shop.shopName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价">
        <template slot-scope="scope">{{ scope.row.shop.shopPrice }}</template>
      </el-table-column>

      <el-table-column label="数量" prop="quantity"></el-table-column>
      <el-table-column label="小计">
        <template slot-scope="scope">
          {{
          (scope.row.shop.shopPrice * scope.row.quantity) | toDecimal
          }}
        </template>
      </el-table-column>
      <div style="margin-top: 20px" slot="append">
        <div class="order-footer clear">
          <div class="submit-con">
            <span>合计：</span>
            <span class="submit-total">
              ￥
              <span id="selectGoodsMoney">{{ sum | toDecimal }}</span>
            </span>
            <el-button class="btn submit-btn" @click.native="toSaveOrderAndPay">确认订单</el-button>
          </div>
        </div>
      </div>
    </el-table>
  </div>
</template>
<script>
import TopBar from "@/components/TopBar.vue";
export default {
  data() {
    return {
      tableData: [],
      deliveryaddress: {},
      user: {}
    };
  },
  mounted() {
    this.$refs.top.activeIndex = "0";
    var cartOrder = JSON.parse(this.$route.query.cartOrder);
    // console.log(cartOrder);
    this.tableData = cartOrder;

    // 查询用户默认地址
    this.user = this.$getSessionStorage("user");
    // this.deliveryaddress = this.$getLocalStorage(this.user.userId);
    this.$axios
      .post(
        "address/default",
        this.$qs.stringify({
          userId: this.user.userId
        })
      )
      .then(res => {
        this.deliveryaddress = res.data;
      })
      .catch(e => {
        console.log(e);
      });
  },
  methods: {
    toUserAddress() {},
    toSaveOrderAndPay() {
      //新增订单所需要的数据，购物车选的需要下订单的商品每一项的id
      var cartIds = [];
      this.tableData.forEach(cart => {
        cartIds.push(cart.cartId);
      });
      //支付宝所需数据
      var vNow = new Date();
      var sNow = "";
      sNow += String(vNow.getFullYear());
      sNow += String(vNow.getMonth() + 1);
      sNow += String(vNow.getDate());
      sNow += String(vNow.getHours());
      sNow += String(vNow.getMinutes());
      sNow += String(vNow.getSeconds());
      sNow += String(vNow.getMilliseconds());
      // document.getElementById("WIDout_trade_no").value =  sNow;
      // document.getElementById("WIDsubject").value = "测试";
      // document.getElementById("WIDtotal_amount").value = "0.01";
      // WIDbody = 商品描述测试
      this.$axios
        .post(
          "pay/topay",
          this.$qs.stringify({
            out_trade_no: sNow,
            subject: "测试",
            total_amount: this.sum,
            body: "商品描述测试",
            userId: this.user.userId,
            daId: this.deliveryaddress.daId,
            businessId: this.tableData[0].businessId,
            cartIds: cartIds
          })
        )
        .then(r => {
          const divForm = document.getElementById("app");
          if (divForm.length) {
            document.body.removeChild(divForm[0]);
          }
          const div = document.createElement("divform");
          div.innerHTML = r.data; // data就是接口返回的form 表单字符串
          document.body.appendChild(div);
          document.forms[0].setAttribute("target", "self"); // 新开窗口跳转
          document.forms[0].submit();
        })
        .catch(() => {});
    }
  },
  computed: {
    sum: function() {
      //总价钱
      var totalSum = 0.0;
      this.tableData.forEach(function(cart) {
        totalSum += cart.food.foodPrice * cart.quantity; //等价于totalSum=totalSum+v.price*v.count
      });
      return totalSum;
    }
  },
  filters: {
    sexFilter(value) {
      return value == 1 ? "先生" : "女士";
    }
  },
  components: {
    TopBar
  }
};
</script>
<style>
/* order-footer */
.order-footer {
  position: relative;
  line-height: 50px;
  background: #eee;
  overflow: hidden;
}
.order-footer .select-con {
  float: left;
  padding-left: 20px;
}
.order-footer .submit-con {
  float: right;
}
.btn {
  background: #c60023;
  color: #eee;
}
.order-footer .submit-con .submit-total,
#selectGoodsCount {
  font-size: 18px;
  color: #c60023;
  font-weight: bold;
  margin-right: 30px;
  vertical-align: middle;
}
#selectGoodsCount {
  margin-right: 5px;
}
.submit-con .submitDis {
  background: #b0b0b0;
  cursor: no-drop;
}
.order-footer .submit-con .btn-submit {
  width: 80px;
  text-align: center;
  height: 50px;
  line-height: 50px;
}
.cartList .foodImg,
.cartList .foodName {
  vertical-align: middle;
}
/****************** 订单信息部分 ******************/
.wrapper .address {
  /*注意这里，不设置高，靠内容撑开。因为地址有可能折行*/
  width: 100%;
  margin-top: 12px;
  background-color: #0097ef;
  box-sizing: border-box;
  padding: 12px;
  color: #fff;
}

.wrapper .address h5 {
  font-size: 26px;
  font-weight: 300;
}

.wrapper .address .address-info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-weight: 700;
  user-select: none;
  cursor: pointer;
  margin: 20px 0;
}

.wrapper .address .address-info p {
  width: 90%;
  font-size: 16px;
}

.wrapper .address .address-info i {
  font-size: 20px;
}

.wrapper .address .address-info p {
  font-size: 12px;
}
</style>
