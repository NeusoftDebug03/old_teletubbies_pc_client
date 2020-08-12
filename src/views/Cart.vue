<template>
  <div>
    <TopBar ref="top"></TopBar>
    <el-table
      class="cartList"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="商品信息" width="350">
        <template slot-scope="scope">
          <img class="shopImg" :src="scope.row.shop.shopImg" alt />
          <span class="shopName">{{scope.row.shop.shopName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" prop="shop.shopPrice"></el-table-column>
      <el-table-column label="数量" width="300" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.quantity"
            @change="handleChange($event,scope.row.cartId)"
            :min="1"
            :max="10"
            label="数量"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="合计">
        <template slot-scope="scope">{{(scope.row.shop.shopPrice*scope.row.quantity)|toDecimal}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="cart-footer clear">
      <div class="delete-con" @click="dels">
        <a class="cart-delete-seleced link">
          <i class="fa fa-trash-o" aria-hidden="true"></i>
          <span>删除选中</span>
        </a>
      </div>
      <div class="submit-con">
        <span>
          已选商品
          <span id="selectGoodsCount">{{totalCount}}</span> 件
        </span>
        <span>总价：</span>
        <span class="submit-total">
          ￥
          <span id="selectGoodsMoney">{{sum|toDecimal}}</span>
        </span>
        <span class="btn submit-btn" :class="totalCount>0?'':'submitDis'">去结算</span>
      </div>
    </div>
  </div>
</template>
<script>
import TopBar from "@/components/TopBar.vue";
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [] //存储选中的列表
    };
  },
  mounted() {
    this.$refs.top.activeIndex = "3";
    this.init();
  },
  methods: {
    init() {
      this.$axios
        .post(
          "cart/listbyuser",
          this.$qs.stringify({ userId: this.$getSessionStorage("user").userId })
        )
        .then(res => {
          this.tableData = res.data;
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    handleSelectionChange(val) {
      //   console.log(val);

      this.multipleSelection = val;
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.delCart([row.cartId]);
    },
    handleChange(quantity, cartId) {
      //   console.log(quantity);
      //   console.log(cartId);
      this.$axios
        .post("cart/updatequantity", { cartId, quantity })
        .then(res => {
          if (res.data > 0) {
            this.$message.success("操作成功");
          } else {
            this.$message.success("操作失败");
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    dels() {
      //
      let ids = [];
      this.multipleSelection.forEach(cart => {
        ids.push(cart.cartId);
      });
      //如果没有选就提示
      if (ids.length == 0) {
        this.$message({
          message: "请选择",
          type: "warning"
        });
        return;
      }
      //批量删除
      this.delCart(ids);
    },
    delCart(ids) {
      this.$axios({
        method: "post",
        url: "cart/mutidelete",
        data: ids
      })
        // .post("cart/mutidelete", { ids })
        .then(res => {
          if (res.data > 0) {
            this.$message.success("操作成功");
            this.init();
          } else {
            this.$message.success("操作失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    cartToOrder() {
      //去结算
      var cartOrder = [];
      for (var i = 0; i < this.multipleSelection.length; i++) {
        cartOrder[i] = this.multipleSelection[i];
      }
      // console.log(cartOrder);
      var cartOrderStr = JSON.stringify(cartOrder);
      this.$router.push({
        path: "/toOrder",
        query: { cartOrder: cartOrderStr },
      });
    },
  },
  computed: {
    totalCount: function() {
      let conuts = 0;
      this.multipleSelection.forEach(cart => {
        conuts += cart.quantity;
      });
      return conuts;
    },
    sum: function() {
      let totalSum = 0;
      this.multipleSelection.forEach(cart => {
        totalSum += cart.shop.shopPrice * cart.quantity;
      });
      return totalSum;
    }
  },
  components: {
    TopBar
  }
};
</script>
<style scoped>
.link {
  color: #999;
  cursor: pointer;
  text-decoration: none;
}
.link:hover {
  color: #e80012;
}
.link-text {
  color: #999;
  text-decoration: none;
}
.cartList {
  margin-top: 50px;
}
.cartList .foodImg,
.cartList .foodName {
  vertical-align: middle;
}
.cartList .foodName {
  margin-left: 20px;
}
/* footer */
.cart-footer {
  position: relative;
  line-height: 50px;
  background: #eee;
  overflow: hidden;
}

.cart-footer .delete-con {
  float: left;
  margin-left: 20px;
}
.cart-footer .submit-con {
  float: right;
}
/* btn */
.btn {
  display: inline-block;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  vertical-align: middle;
  border: none;
  background: #c60023;
  font-size: 17px;
  font-weight: bold;
  color: #fff;
  outline: none;
  cursor: pointer;
  text-decoration: none;
}
.cart-footer .submit-con .submit-total,
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
.cart-footer .submit-con .btn-submit {
  width: 80px;
  text-align: center;
  height: 50px;
  line-height: 50px;
}
</style>