<template>
  <div class="qr-panel">
    <div class="qr-box">
      <img
        v-if="qrData.qrCode"
        :src="qrData.qrCode"
        alt="QRCode"
        class="qr-image"
      />
      <div v-else class="qr-placeholder">QR Code</div>
      <p v-if="showCountdown && countdownDisplay" class="countdown">
        QR Code 於 {{ countdownDisplay }} 後失效
      </p>
    </div>
    <div v-if="showRegenerateButton" class="actions">
      <el-button type="primary" size="small" @click="start"
        >重新產生 QRCode</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import {
  requestAutoFillQr,
  requestAutoFillResult,
  requestVerifyIdQr,
  requestVerifyIdResult,
} from "../services/issuer.js";
import { generateUUID } from "@/utils/uuid";

const props = defineProps({
  showCountdown: { type: Boolean, default: true },
  pollIntervalMs: { type: Number, default: 1000 },
  showRegenerateButton: { type: Boolean, default: true },
  // 使用 'autofill' 或 'verify' API 模式
  apiMode: {
    type: String,
    default: "autofill",
    validator: (value) => ["autofill", "verify"].includes(value),
  },
});

const emit = defineEmits(["success", "openChange"]);

const qrData = reactive({ transactionId: "", qrCode: "", deepLink: "" });
const currentTransactionId = ref("");
let pollingTimer = null;
const countdownSeconds = ref(300);
const countdownTimer = ref(null);
const countdownDisplay = ref("05:00");

function pad2(n) {
  return String(n).padStart(2, "0");
}
function updateCountdownDisplay() {
  const m = Math.floor(countdownSeconds.value / 60);
  const s = countdownSeconds.value % 60;
  countdownDisplay.value = `${pad2(m)}:${pad2(s)}`;
}
function startCountdown() {
  stopCountdown();
  countdownSeconds.value = 300;
  updateCountdownDisplay();
  countdownTimer.value = setInterval(() => {
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
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
    countdownTimer.value = null;
  }
}
function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

async function start() {
  try {
    const transactionId = generateUUID();
    currentTransactionId.value = transactionId;

    // 根據 apiMode 選擇使用不同的 API
    let res;
    if (props.apiMode === "verify") {
      res = await requestVerifyIdQr(transactionId);
    } else {
      res = await requestAutoFillQr(transactionId);
    }

    // 注意：key 名稱使用 qrcodeImage，不可變更
    qrData.transactionId = res?.transactionId || "";
    qrData.qrCode = res?.qrcodeImage || "";
    // verify 模式使用 authUri，autofill 模式使用 deepLink
    qrData.deepLink = res?.authUri || res?.deepLink || "";
    emit("openChange", true);
    if (props.showCountdown) startCountdown();
    if (currentTransactionId.value) startPolling(currentTransactionId.value);
    ElMessage.success("取得 QRCode 成功");
  } catch (e) {
    ElMessage.error("取得 QRCode 失敗");
  }
}

function startPolling(transactionId) {
  stopPolling();
  pollingTimer = setInterval(async () => {
    try {
      let res;
      if (props.apiMode === "verify") {
        res = await requestVerifyIdResult(transactionId);
      } else {
        res = await requestAutoFillResult(transactionId);
      }

      // verify 模式檢查 verifyResult 和 data，autofill 模式檢查 data 或 status
      const isReady =
        props.apiMode === "verify"
          ? res?.verifyResult === true && res?.data
          : res && (res.data || res.status === "ready");

      if (isReady) {
        const d = props.apiMode === "verify" ? res : res.data || res;
        stopPolling();
        stopCountdown();
        emit("openChange", false);
        emit("success", d);
        ElMessage.success("驗證成功，資料已取得");
      }
    } catch (e) {}
  }, props.pollIntervalMs);
}

onMounted(() => {
  // 如果 showRegenerateButton 为 false，自动生成 QRCode
  if (!props.showRegenerateButton) {
    start();
  }
});

onUnmounted(() => {
  stopCountdown();
  stopPolling();
});

defineExpose({ start });
</script>

<style scoped>
.qr-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.qr-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.qr-image {
  max-width: 320px;
  width: 100%;
}
.qr-placeholder {
  width: 320px;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 8px;
}
.countdown {
  margin-top: 8px;
  color: #ef4444;
  font-weight: bold;
}
.actions {
  margin-top: 6px;
}
</style>
