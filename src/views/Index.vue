<template>
  <div>
    <!-- 顶部导航 -->
    <TopBar></TopBar>
    <!-- 轮播图 -->
    <div class="dcfl">
      <el-carousel :interval="4000" height="400px" :autoplay="false">
        <!-- <el-carousel-item v-for="item in 6" :key="item">
          <h3 class="medium">{{ item }}</h3>
        </el-carousel-item>-->
        <el-carousel-item>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/tongzhuang.jpg" class="image" />
                <div style="padding: 14px;">
                  <span>童装童鞋</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/tuiche.jpg" class="image" />
                <div style="padding: 14px;">
                  <span>车床坐骑</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/tushu.jpg" class="image" />
                <div style="padding: 14px;">
                  <span>儿童图书</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/wanju.jpg" class="image" />
                <div style="padding: 14px;">
                  <span>儿童玩具</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-carousel-item>
        <el-carousel-item>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/weiyang.jpg" class="image" />
                <div style="padding: 14px;">
                  <span>喂养用品</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/xihu.jpg" class="image" />
                <div style="padding: 14px;">
                  <span>洗护用品</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/naifen.jpg" class="image" />
                <div style="padding: 14px;">
                  <span>奶粉</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/zhiniaoku.jpg" class="image" />
                <div style="padding: 14px;">
                  <span>纸尿裤</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-carousel-item>
      </el-carousel>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in list" :key="index" :label="item" :name="item">
        <BussinessList :index="index" />
      </el-tab-pane>
      <!-- <el-tab-pane label="销量" name="second"></el-tab-pane><BussinessList />
      <el-tab-pane label="价格" name="third"></el-tab-pane><BussinessList />
      <el-tab-pane label="好评最多" name="fourth"
        ><BussinessList />
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>
<script>
import TopBar from "@/components/TopBar.vue";
import BussinessList from "@/views/BusinessList.vue";
export default {
  data() {
    return {
      activeName: "second",
      bsortType: 0,
      blist: [],
      list: ["默认", "销量", "价格", "好评最多"],
      po: "BussinessList"
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab._data.index, event);
      //initblist(tab._data.index);
    },
    // 获取商家列表
    initblist(sortType) {
      this.$axios
        .post(
          "business/list",
          this.$qs.stringify({
            sortType
          })
        )
        .then(response => {
          this.blist = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  components: {
    TopBar,
    BussinessList
  }
};
</script>
<style>
.dcfl {
  margin: 20px auto;
  padding: 20px;
}
img{
  width:100%;
  height:inherit;
}
.el-carousel__item {
  padding-left: 10px;
  padding-right: 10px;
}

.el-col {
  border-radius: 4px;
}
.dcfl .el-row,
.dcfl .el-col {
  height: 100%;
}
.dcfl .el-row {
  margin-top: 12px;
  margin-right: 0px;
  margin-left: 0px;
}
.dcfl .el-card__body {
  text-align: center;
}
</style>
