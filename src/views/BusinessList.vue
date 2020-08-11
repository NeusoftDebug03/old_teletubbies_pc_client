<template>
  <div class="wrapper">
    <!-- 商家列表部分 -->
    <ul class="business" v-for="(b, index) in blist" :key="index">
      <li @click="toBusinessInfo(b.businessId)">
        <div class="business-img">
          <img :src="b.businessImg" />
          <div v-if="index == 0" class="business-img-quantity">3</div>
          <div v-else-if="index == 1" class="business-img-quantity">2</div>
          <div v-else-if="index == 2" class="business-img-quantity">1</div>
        </div>
        <div class="business-info">
          <h3>{{ b.businessName }}</h3>
          <p>&#165;{{ b.starPrice }}起送 | &#165;{{ b.deliveryPrice }}配送</p>
          <p>{{ b.businessExplain }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      blist: []
    };
  },
  methods: {
    toBusinessInfo(businessId) {
      this.$router.push({
        path: "/businessInfo",
        query: { businessId }
      });
    }
  },
  mounted() {
    // console.log(this.$route.query.bsorttype);

    this.$axios
      .post(
        "business/list",
        this.$qs.stringify({
          orderTypeId: 1
        })
      )
      .then(response => {
        this.blist = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>
<style scoped>
/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100%;
}

/****************** 商家列表部分 ******************/
.wrapper .business {
  width: 100%;
  margin-top: 12px;
  margin-bottom: 28px;
}
.wrapper .business li {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border-bottom: solid 1px #ddd;
  user-select: none;
  cursor: pointer;

  display: flex;
  align-items: center;
}
.wrapper .business li .business-img {
  /*这里设置为相当定位，成为business-img-quantity元素的父元素*/
  position: relative;
}
.wrapper .business li .business-img img {
  width: 130px;
  height: 130px;
}
.wrapper .business li .business-img .business-img-quantity {
  width: 30px;
  height: 30px;
  background-color: red;
  color: #fff;
  font-size: 18px;
  border-radius: 15px;

  display: flex;
  justify-content: center;
  align-items: center;

  /*设置成绝对定位，不占文档流空间*/
  position: absolute;
  right: -6px;
  top: -6px;
}
.wrapper .business li .business-info {
  margin-left: 20px;
}
.wrapper .business li .business-info h3 {
  font-size: 26px;
  color: #555;
}
.wrapper .business li .business-info p {
  font-size: 20px;
  color: #888;
  margin-top: 4px;
}
</style>
