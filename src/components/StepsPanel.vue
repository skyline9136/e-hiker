<template>
  <el-card class="info-card">
    <template #header>
      <h3>{{ title }}</h3>
    </template>
    <div class="process-steps">
      <div class="step-item" v-for="(s, idx) in steps" :key="idx">
        <div class="step-number" :class="{ active: currentIndex === idx }">{{ idx + 1 }}</div>
        <div class="step-content">
          <h4>{{ getTitle(s) }}</h4>
          <p v-if="getDesc(s)">{{ getDesc(s) }}</p>
        </div>
      </div>
    </div>
  </el-card>
  
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: "入山步驟" },
  steps: { type: Array, required: true },
  // 0-based index
  currentIndex: { type: Number, default: 0 },
});

function getTitle(s) {
  return typeof s === "string" ? s : s?.title || "";
}
function getDesc(s) {
  return typeof s === "string" ? "" : s?.desc || "";
}
</script>

<style scoped>
.process-steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.step-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}
.step-number {
  width: 30px;
  height: 30px;
  background: #cbd5e1; /* slate-300 */
  color: #111827; /* gray-900 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}
.step-number.active {
  background: #27ae60; /* green tone to match creation page */
  color: white;
}
.step-content h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 1rem;
}
.step-content p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}
</style>


