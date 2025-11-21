<template>
  <div id="app">
    <el-container>
      <el-header>
        <NavBar />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";
</script>

<style>
#app {
  font-family: "Microsoft JhengHei", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-header {
  background-color: #409eff;
  color: white;
  padding: 0;
}

.el-main {
  min-height: calc(100vh - 120px);
  padding: 20px;
}

.el-footer {
  background-color: #f5f5f5;
  color: #606266;
  text-align: center;
  padding: 0;
}
</style>
