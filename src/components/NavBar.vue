<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <AppIcon name="Mountain" :size="32" color="white" />
        <span class="brand-text">E-Hiker</span>
      </div>

      <div class="nav-menu">
        <a href="/" class="nav-link" :class="{ active: activeIndex === '/' }">
          首頁
        </a>
        <a
          href="/fill-vcs"
          class="nav-link"
          :class="{ active: activeIndex === '/fill-vcs' }"
        >
          填寫基本資料
        </a>
        <a
          href="/team-creation"
          class="nav-link"
          :class="{ active: activeIndex === '/team-creation' }"
        >
          隊伍建立
        </a>
        <a
          href="/team-join"
          class="nav-link"
          :class="{ active: activeIndex === '/team-join' }"
        >
          隊員入隊申請
        </a>
        <a
          href="/entry-verification"
          class="nav-link"
          :class="{ active: activeIndex === '/entry-verification' }"
        >
          入山驗證
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppIcon from "./AppIcon.vue";

const route = useRoute();

const activeIndex = computed(() => route.path);
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 70px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.brand-text {
  font-family: "Arial", sans-serif;
  letter-spacing: 1px;
}

.nav-menu {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.15);
  color: #f39c12;
}

.nav-link.active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background-color: #f39c12;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
  }

  .nav-menu {
    margin-top: 15px;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-link {
    font-size: 14px;
    padding: 8px 12px;
  }
}
</style>
