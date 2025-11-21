<template>
  <el-dialog
    v-model="visibleLocal"
    :title="title"
    width="520px"
    @close="handleClose"
  >
    <div style="text-align: center">
      <img
        v-if="qrCode"
        :src="qrCode"
        alt="QRCode"
        style="max-width: 320px; width: 100%"
      />
      <p style="margin-top: 8px; color: #ef4444; font-weight: bold">
        QR Code 於 {{ countdownDisplay }} 後失效
      </p>
    </div>
    <template #footer>
      <el-button @click="visibleLocal = false">關閉</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { requestCredentialResult } from "../services/issuer.js";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "VC QR Code" },
  transactionId: { type: String, default: "" },
  qrCode: { type: String, default: "" },
  pollIntervalMs: { type: Number, default: 1000 },
});

const emit = defineEmits(["update:modelValue", "success"]);

const visibleLocal = ref(props.modelValue);
watch(
  () => props.modelValue,
  (v) => {
    visibleLocal.value = v;
  }
);
watch(visibleLocal, (v) => emit("update:modelValue", v));

// Countdown
const countdownSeconds = ref(300);
const countdownDisplay = ref("05:00");
let countdownTimer = null;
function updateCountdownDisplay() {
  const m = Math.floor(countdownSeconds.value / 60);
  const s = countdownSeconds.value % 60;
  countdownDisplay.value = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function startCountdown() {
  stopCountdown();
  countdownSeconds.value = 300;
  updateCountdownDisplay();
  countdownTimer = setInterval(() => {
    if (countdownSeconds.value <= 1) {
      countdownSeconds.value = 0;
      updateCountdownDisplay();
      stopCountdown();
      return;
    }
    countdownSeconds.value -= 1;
    updateCountdownDisplay();
  }, 1000);
}
function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

// Polling
let pollingTimer = null;
function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

function handleClose() {
  stopCountdown();
  stopPolling();
}

watch(
  () => ({ open: visibleLocal.value, tx: props.transactionId }),
  async ({ open, tx }) => {
    if (open && tx) {
      startCountdown();
      startPolling(tx);
    } else {
      stopCountdown();
      stopPolling();
    }
  },
  { deep: true, immediate: true }
);

function isSuccessResponse(data) {
  // Treat any non-null 200 OK payload as success; backend formats may vary
  if (data == null) return false;
  return true;
}

function startPolling(transactionId) {
  stopPolling();
  pollingTimer = setInterval(async () => {
    try {
      const data = await requestCredentialResult(transactionId);
      // If HTTP 200 without throwing, consider success OR further check payload
      if (isSuccessResponse(data)) {
        stopPolling();
        stopCountdown();
        visibleLocal.value = false;
        ElMessage.success("申請完成");
        emit("success", { transactionId });
      }
    } catch (e) {
      // keep polling on errors (e.g., not ready yet). Optional: add timeout/limit.
    }
  }, props.pollIntervalMs);
}

onUnmounted(() => {
  stopCountdown();
  stopPolling();
});
</script>

<style scoped>
</style>


