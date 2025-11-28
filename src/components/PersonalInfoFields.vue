<template>
  <div>
    <div style="display: flex; justify-content: flex-end; margin-bottom: 10px" v-if="showAutoFill">
      <el-button type="primary" size="small" @click="startAutoFill">
        <AppIcon name="ScanSearch" :size="18" style="margin-right: 4px" /> 自動代入個資
      </el-button>
    </div>
    <!-- 第一列：姓名 + 手機 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="local.name" placeholder="請輸入姓名" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="手機" prop="mobile">
          <el-input v-model="local.mobile" placeholder="請輸入手機" />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- Email -->
    <el-form-item label="Email" prop="email">
      <el-input v-model="local.email" placeholder="請輸入 Email" />
    </el-form-item>
    <!-- 通訊地址 -->
    <el-form-item label="通訊地址" prop="address">
      <el-input v-model="local.address" placeholder="請輸入通訊地址" />
    </el-form-item>
    <!-- 電話 + 傳真 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="電話" prop="phone">
          <el-input v-model="local.phone" placeholder="請輸入電話" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="傳真" prop="fax">
          <el-input v-model="local.fax" placeholder="請輸入傳真" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="身分證字號" prop="idNumber">
          <el-input v-model="local.idNumber" placeholder="請輸入身分證字號" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性別" prop="gender">
          <el-select v-model="local.gender" placeholder="請選擇性別" style="width: 100%">
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="生日" prop="birthday">
          <el-date-picker v-model="local.birthday" type="date" placeholder="選擇生日" style="width: 100%" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="緊急聯絡人" prop="emergencyName">
          <el-input v-model="local.emergencyName" placeholder="請輸入緊急聯絡人" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="緊急聯絡電話" prop="emergencyPhone">
          <el-input v-model="local.emergencyPhone" placeholder="請輸入聯絡電話" />
        </el-form-item>
      </el-col>
    </el-row>
  </div>

  <!-- 內建：QRCode 對話框 -->
  <el-dialog v-model="qrDialogVisible" title="自動帶入 QRCode" width="520px">
    <div style="text-align: center">
      <img v-if="qrData.qrCode" :src="qrData.qrCode" alt="QRCode" style="max-width: 320px; width: 100%" />
      <p style="margin-top: 8px; color: #ef4444; font-weight: bold">
        QR Code 於 {{ countdownDisplay }} 後失效
      </p>
    </div>
    <template #footer>
      <el-button @click="qrDialogVisible = false">關閉</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { watch, ref, reactive, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import AppIcon from "../components/AppIcon.vue";
import { requestAutoFillQr, requestAutoFillResult } from "../services/issuer.js";
import { generateUUID } from "@/utils/uuid";

const props = defineProps({
  showAutoFill: {
    type: Boolean,
    default: false,
  },
});

// 使用 Vue 3.3 defineModel 直接雙向綁定父層的 modelValue
// 在父層可用 v-model:modelValue 綁定；模板自動解包 ref，可直接使用 local.xxx
const local = defineModel('modelValue', { type: Object, required: true });

// 根據身分證第2碼自動設定性別（1=male, 2=female）
watch(
  () => local.value?.idNumber,
  (val) => {
    if (typeof val === "string" && /^[A-Z][0-9]{9}$/i.test(val)) {
      const secondChar = val.charAt(1);
      if (secondChar === "1") local.value.gender = "male";
      else if (secondChar === "2") local.value.gender = "female";
    }
  }
);

// 內建 QRCode 流程
const qrDialogVisible = ref(false);
const qrData = reactive({ transactionId: "", qrCode: "", deepLink: "" });
const currentTransactionId = ref("");
const countdownSeconds = ref(300);
const countdownTimer = ref(null);
const countdownDisplay = ref("05:00");

function updateCountdownDisplay() {
  const m = Math.floor(countdownSeconds.value / 60);
  const s = countdownSeconds.value % 60;
  countdownDisplay.value = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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
let pollingTimer = null;
function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}
onUnmounted(() => {
  stopCountdown();
  stopPolling();
});

function showQrDialog(res) {
  qrData.transactionId = res?.transactionId || "";
  qrData.qrCode = res?.qrcodeImage || ""; // 注意 qrcodeImage keyname 不變
  qrData.deepLink = res?.deepLink || "";
  qrDialogVisible.value = true;
  startCountdown();
  if (currentTransactionId.value) startPolling(currentTransactionId.value);
}

async function startAutoFill() {
  try {
    const transactionId = generateUUID();
    currentTransactionId.value = transactionId;
    const res = await requestAutoFillQr(transactionId);
    showQrDialog(res);
    ElMessage.success("取得 QRCode 成功，請掃描自動帶入個資");
  } catch (err) {
    ElMessage.error("取得 QRCode 失敗");
  }
}

function mapOidvpResultToLocal(d) {
  // d 可能是 { data: [...], ... } 或直接是数组
  let list = [];
  if (Array.isArray(d)) {
    list = d;
  } else if (Array.isArray(d?.data)) {
    list = d.data;
  }
  
  for (const item of list) {
    const type = item.credentialType;
    const claims = item.claims || [];
    for (const c of claims) {
      const { ename, value } = c;
      // 支持 digital_business_card 和 digital_business_card2
      if (type === "00000000_digital_business_card" || type === "00000000_digital_business_card2") {
        if (ename === "name") local.value.name = value || local.value.name;
        if (ename === "phoneNumber") local.value.mobile = value || local.value.mobile;
        if (ename === "email") local.value.email = value || local.value.email;
        if (ename === "contactAddress") local.value.address = value || local.value.address;
        if (ename === "tel") local.value.phone = value || local.value.phone;
        if (ename === "fax") local.value.fax = value || local.value.fax;
      } else if (type === "00000000_emergency_contact_card") {
        if (ename === "emergencyContactName") local.value.emergencyName = value || local.value.emergencyName;
        if (ename === "emergencyContactNumber") local.value.emergencyPhone = value || local.value.emergencyPhone;
      } else if (type === "00000000_roc_id_card") {
        if (ename === "id_number") local.value.idNumber = value || local.value.idNumber;
        if (ename === "roc_birthday") {
          const y = Number(value?.slice(0, 3) || 0) + 1911;
          const m = value?.slice(3, 5) || "01";
          const dstr = value?.slice(5, 7) || "01";
          if (y > 1911) local.value.birthday = `${y}-${m.padStart(2, "0")}-${dstr.padStart(2, "0")}`;
        }
      }
    }
  }
}

function startPolling(transactionId) {
  stopPolling();
  pollingTimer = setInterval(async () => {
    try {
      const res = await requestAutoFillResult(transactionId);
      // 如果返回数据有 data 字段或直接是数组，或 status 为 ready
      if (res && (res.data || Array.isArray(res) || res.status === "ready")) {
        // 直接传递 res，让 mapOidvpResultToLocal 处理不同格式
        mapOidvpResultToLocal(res);
        stopPolling();
        stopCountdown();
        qrDialogVisible.value = false;
        ElMessage.success("已自動帶入個資");
      }
    } catch (e) {}
  }, 1000);
}
</script>

<style scoped>
</style>


