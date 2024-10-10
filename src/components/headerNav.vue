<script setup>
import { ref } from "vue";
const searchVal = ref("");
const all = ref([]);
let routerPath = ref(window.location.pathname);
// 搜索
const searchEnter = () => {
  const arr = filterByName(searchVal.value);
  tvList.value = arr;
};
// name搜索剧集
const filterByName = (name) => {
  const list = all.filter((item) =>
    item.name.toLowerCase().includes(name.toLowerCase())
  );
  return list;
};
const setRouteer = (type) => {
  routerPath.value = type;
};
</script>
<template>
  <div class="nav">
    <div class="header-container">
      <div class="container-width">
        <el-row :gutter="24">
          <el-col :xs="10" :sm="5" :md="4" :lg="4">
            <router-link to="/" class="header-logo-flex">
              <img src="../assets/logo.png" class="header-logo" />
            </router-link>
          </el-col>
          <el-col :xs="12" :sm="5" :md="5" :lg="4" class="header-menu-flex">
            <div class="header-menu" data-v-f4944254>
              <router-link
                to="/"
                class="header-menu-item nuxt-link-active"
                :class="routerPath == '/'?'active':''"
                @click="setRouteer('/')"
                >Home
              </router-link>
              <router-link
                to="/genre"
                class="header-menu-item nuxt-link-exact-active nuxt-link-active"
                :class="routerPath == '/genre'?'active':''"
                @click="setRouteer('/genre')"
                >Genre
              </router-link>
            </div>
          </el-col>
          <el-col :xs="0" :sm="13" :md="14" :lg="16">
            <div class="search">
              <div class="search-input">
                <div class="search-input-icon"></div>
                <input
                  value=""
                  v-model="searchVal"
                  @keyup.enter="searchEnter"
                  placeholder="Enter the title of the mini-series"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import "../assets/css/headerNav.css";
</style>