<script setup>
import data from "../assets/api/data";
import List from "../components/list.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
let MobileShow = isMobile;
const router = useRouter();
const YouMightLike = ref(data.mightLikeList_);
const NewReleases = ref(data.newReleasesList_);
const indexRecommend = ref(data.indexRecommend_);
const goPlay = (info) => {
  localStorage.setItem("videoInfo", JSON.stringify(info));
  router.push(`/play/${info.id}/${info.name}/1`);
};
</script>
<template>
  <div>
    <!-- 首页推荐 -->
    <div class="space-between home-top" v-if="!MobileShow">
      <!-- pc端展示 -->
      <el-row :gutter="16">
        <el-col :md="15" :lg="15">
          <a class="home-top-left" @click="goPlay(indexRecommend[0])">
            <div class="home-top-left-img">
              <img :src="indexRecommend[0].img" :alt="indexRecommend[0].name" />
            </div>
            <div>
              <h2 class="home-top-left-title">
                {{ indexRecommend[0].name }}
              </h2>
              <div class="home-top-left-labels">
                <span
                  data-v-853b6436=""
                  v-for="item in indexRecommend[0].label"
                  :key="item"
                  >{{ item }}</span
                >
              </div>
              <div class="home-top-left-desc">
                {{ indexRecommend[0].content }}
              </div>
              <div class="home-top-left-btn">Play</div>
            </div>
          </a>
        </el-col>
        <el-col :md="9" :lg="9">
          <div class="home-top-right space-between">
            <el-row>
              <el-col :span="24" style="margin-bottom: 16px">
                <a
                  class="home-top-right-item"
                  @click="goPlay(indexRecommend[1])"
                  ><div class="home-top-right-item-img">
                    <img
                      :src="indexRecommend[1].img"
                      :alt="indexRecommend[1].name"
                    />
                  </div>
                  <div>
                    <h2 class="home-top-right-item-title">
                      {{ indexRecommend[1].name }}
                    </h2>
                    <div class="home-top-right-item-desc">
                      {{ indexRecommend[1].content }}
                    </div>
                  </div></a
                >
              </el-col>
              <el-col :span="24">
                <a
                  class="home-top-right-item"
                  @click="goPlay(indexRecommend[2])"
                  ><div class="home-top-right-item-img">
                    <img
                      :src="indexRecommend[2].img"
                      :alt="indexRecommend[2].name"
                    />
                  </div>
                  <div>
                    <h2 class="home-top-right-item-title">
                      {{ indexRecommend[2].name }}
                    </h2>
                    <div class="home-top-right-item-desc">
                      {{ indexRecommend[2].content }}
                    </div>
                  </div></a
                >
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 移动端界面 -->
    <div v-else>
      <div class="list">
        <a
          class="list-item active"
          v-for="item in indexRecommend"
          :key="item.name"
          @click="goPlay(item)"
        >
          <div class="list-item-img">
            <img :src="item.img" />
          </div>
        </a>
      </div>
      <h3 class="home-top-title">{{ indexRecommend[0].name }}</h3>
				<h3 class="home-top-subTitle">
					{{ indexRecommend[0].content }}
				</h3>
    </div>
    <!-- 猜你喜欢 -->
    <div class="home-list">
      <h2 class="home-list-title">You Might Like</h2>
      <List :list="YouMightLike" />
    </div>
    <!-- 视频列表 -->
    <div class="home-list">
      <h2 class="home-list-title">New Releases</h2>
      <List :list="NewReleases" />
    </div>
  </div>
</template>
<style scoped>
@import "../assets/css/index/between.css";
</style>