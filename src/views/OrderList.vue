<template>
  <div>
    <div
      style="margin:20px;padding:10px;border:1px solid #EBEEF5"
      v-for="item in orderList"
      :key="item.orderId"
    >
      <div style="padding:10px;background-color: #f1f1f1;">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">日期：{{ item.orderDate }}</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">订单号：{{ item.orderId }}</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">总计：{{ item.orderTotal }}</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">订单号：{{ item.orderState==1?'已支付':'未支付' }}</div>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="item.orderDetails"
        style="width: 100%;text-align:center"
        :show-header="isShow"
        border
        :span-method="objectSpanMethod"
      >
        <el-table-column>
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px;" :src="scope.row.shop.shopImg"></el-image>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">{{ scope.row.shop.shopName }}</template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">￥{{ scope.row.shop.shopPrice | toDecimal }}</template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">{{ scope.row.quantity }}</template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            ￥{{
            (scope.row.food.foodPrice * scope.row.quantity) | toDecimal
            }}
          </template>
        </el-table-column>

        <el-table-column>
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">取消</el-button>
          </template>
        </el-table-column>
        <el-table-column>￥{{ item.orderTotal | toDecimal }}</el-table-column>
        <el-table-column>
          <el-tooltip placement="bottom">
            <div slot="content">
              收件人：{{ item.address.contactName }}
              <br />
              收货地址：{{ item.address.address }}
            </div>
            <el-link type="danger">收货信息</el-link>
          </el-tooltip>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderList: [],
      isShow: false,
      maxRow: 1
    };
  },
  created() {
    this.$axios
      .post(
        "orders/listOrdersByUserId",
        this.$qs.stringify({ userId: this.$getSessionStorage("user").userId })
      )
      .then(r => {
        this.orderList = r.data;
        var allnums = []; //设置跨行需要的参数
        r.forEach(e => {
          allnums.push(e.orderDetailList.length);
        });
        this.maxRow = allnums.reduce((x, y) => {
          return x > y ? x : y;
        });
        // console.log(this.maxRow);
      })
      .catch(() => {});
  },
  methods: {
    objectSpanMethod({ rowIndex, columnIndex }) {
      let self = this;
      if (columnIndex === 6 || columnIndex === 7) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: self.maxRow,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    handleDelete(index, row) {
      console.log(index);
      console.log(row);
    }
  }
};
</script>
<style lang="scss">
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  padding: 10px 0;
}
.el-table td {
  text-align: center;
  vertical-align: top;
}
.el-table--enable-row-hover,
.el-table tbody tr:hover > td {
  background-color: #fff !important;
}

// .el-table tr:not(:last-child) td:nth-child(7),.el-table tr:not(:last-child) td:nth-child(8){
//   border-bottom: 0;
// }
.el-table td:nth-child(2),
.el-table td:nth-child(3),
.el-table td:nth-child(4),
.el-table td:nth-child(5) {
  border-left: 0;
  border-right: 0;
}
.el-table td:nth-child(1) {
  border-right: 0;
}
</style>
