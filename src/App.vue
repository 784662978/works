<script setup>
import headerNav from "./components/headerNav.vue";
import Footer from "./components/footer.vue";
</script>

<template>
  <headerNav />
  <div class="layout-content">
    <router-view />
  </div>
  <Footer />
</template>

<style scoped>
.layout-content {
  min-height: 90vh;
  margin: 0 auto;
  max-width: 1200px;
  padding-top: 66px;
}
</style>
