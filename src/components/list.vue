<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
    list: {
        type: Array,
        default: []
    }
})
const playVideo = (info) => {
  localStorage.setItem("videoInfo", JSON.stringify(info));
  router.push(`/play/${info.id}/${info.name}/1`)
}
</script>
<template>
  <div class="home-list-content">
    <a
      v-for="(item, index) in list"
      :key="index"
      class="home-list-item"
      @click="playVideo(item)"
    >
      <div class="home-list-item-img">
        <!-- <img :src="item.img" /> -->
        <el-image :src="item.img" lazy/>
      </div>
      <div class="home-list-item-bottom">
        <h3 class="home-list-item-title">
          {{ item.name }}
        </h3>
        <div class="home-list-item-labels">
          <div class="home-list-item-label" v-for="labels in item.label" :key="labels">
            <span>{{ labels }}</span>
          </div>
        </div>
      </div>
      <div class="home-list-item-play"></div>
    </a>
  </div>
</template>
<style scoped>
@import "../assets/css/list.css";
</style>