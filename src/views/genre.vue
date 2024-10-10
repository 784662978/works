<script setup>
import { ref } from "vue";
import data from "../assets/api/data";
import List from "../components/list.vue";
const { indexRecommend_, newReleasesList_, mustWatchList_ } = data;
const all_ = [...indexRecommend_, ...newReleasesList_, ...mustWatchList_];
let searchTerms = ref(
  localStorage.getItem("searchTerms")
    ? localStorage.getItem("searchTerms")
    : "All"
);
const filterByLabel = (label) => {
  searchTerms.value = label;
  localStorage.setItem("searchTerms", label);
  let list = all_;
  if (label !== "All") {
    list = all_.filter((item) => item.label.includes(label));
  }
  const map = new Map();
  const newList = list.filter((v) => !map.has(v.id) && map.set(v.id, v));
  dataList.value = newList;
};
let allGenres = [
  "All",
  ...new Set(
    all_.reduce((acc, current) => {
      return acc.concat(current.genre);
    }, [])
  ),
];
const genres = ref(allGenres);

const dataList = ref(all_);
</script>
<template>
  <div class="genre">
    <div class="genre-sidebar">
      <div class="genre-sidebar-sticky">
        <span
          @click="filterByLabel(item)"
          v-for="item in genres"
          :key="item"
          :class="['genre-sidebar-item', searchTerms === item ? 'active' : '']"
          >{{ item }}
        </span>
      </div>
    </div>
    <div>
      <List :list="dataList" class="genre-style" />
    </div>
  </div>
</template>
<style>
@media (max-width: 746px) {
  .genre-style.genre-style {
    padding: 0;
    justify-content:left;
  }
  .genre-style .home-list-item {
    height: 20.4375rem;
    margin-left: 1.4375rem;
    width: 10.8125rem;
    padding-bottom: 1.5rem;
  }
  .genre-style .home-list-item-img {
    background: #fff;
    border-radius: 0.625rem;
    height: 14.40625rem;
    overflow: hidden;
    width: 10.8125rem;
  }
}
</style>
<style scoped>
.genre {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
}
.genre-sidebar {
  width: 180px;
  -ms-flex-negative: 0;
  color: #666;
  flex-shrink: 0;
  font-size: 16px;
  line-height: 20px;
}
.genre-sidebar-sticky {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 66px;
  position: fixed;
  top: 66px;
  width: 160px;
  z-index: 1000;
}
.genre-sidebar-item {
  cursor: pointer;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  height: 42px;
  transition: 0.3s;
  -webkit-transition: 0.3s;
  -webkit-box-align: center;
  -moz-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.genre-sidebar-item.active {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}
@media (max-width: 746px) {
  .genre-sidebar-item,
  .genre-sidebar-sticky {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 7.84375rem;
  }
  .genre-sidebar {
    height: 100vh;
    width: 7.84375rem;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }
  .genre-sidebar-item {
    cursor: pointer;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    height: 5.3125rem;
    position: relative;
    transition: 0.3s;
    -webkit-transition: 0.3s;
    -webkit-box-align: center;
    -moz-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background: rgba(38, 37, 43, 0.3);
    color: #666;
    margin-bottom: 0.1875rem;
    padding: 0 0.71875rem 0 1.09375rem;
  }
  .genre-sidebar-item {
    font-size: 1.15625rem;
    line-height: 1.625rem;
  }
  .genre-sidebar-item.active {
    background: #26252b;
    color: #fff;
    font-weight: 700;
    font-size: 1.15625rem;
  }
  .genre-sidebar-item.active:before {
    background: #d62448;
    content: "";
    display: block;
    height: 5.3125rem;
    left: 0;
    position: absolute;
    top: 0;
    width: 0.28125rem;
  }
  .home-list-item {
    width: 10.8125rem;
  }
  .genre-style .home-list-item {
    height: 20.4375rem;
    margin-left: 1.4375rem;
    width: 10.8125rem;
    padding-bottom: 1.5rem;
  }
  .genre-style .genre-list-item-img {
    background: #fff;
    border-radius: 0.625rem;
    height: 14.40625rem;
    overflow: hidden;
    width: 10.8125rem;
  }
}
</style>