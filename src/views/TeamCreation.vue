<template>
  <div class="team-creation-page">
    <!-- 頁面標題區域 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1>隊伍建立</h1>
          <p>創建您的登山隊伍，邀請志同道合的夥伴一起探險</p>
        </div>
      </div>
    </section>

    <!-- 主要內容區域 -->
    <section class="main-content">
      <div class="container">
        <div class="content-grid">
          <div class="form-section">
            <el-card class="form-card">
              <template #header>
                <div class="card-header">
                  <AppIcon name="User" :size="28" color="green-500" />
                  <h2>隊伍建立</h2>
                </div>
              </template>
              <!-- 區塊：輸入領隊資料 -->
              <h3 style="margin: 10px 0 0 0; color: #2c3e50">輸入領隊資料</h3>
              <el-form
                ref="leaderRef"
                :model="leader"
                :rules="leaderRules"
                label-width="120px"
                size="large"
              >
                <PersonalInfoFields v-model="leader" :show-auto-fill="true" />
              </el-form>

              <!-- 區塊：登山計畫 -->
              <h3 style="margin: 20px 0 0 0; color: #2c3e50">登山計畫</h3>
              <el-form
                ref="planRef"
                :model="plan"
                :rules="planRules"
                label-width="120px"
                size="large"
              >
                <el-form-item label="隊名" prop="teamName">
                  <el-input v-model="plan.teamName" placeholder="請輸入隊名" />
                </el-form-item>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="人數" prop="groupSize">
                      <el-input-number
                        v-model="plan.groupSize"
                        :min="1"
                        :max="50"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="登山主路線" prop="mainRoute">
                      <el-select
                        v-model="plan.mainRoute"
                        placeholder="請選擇主路線"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="opt in routes"
                          :key="opt.value"
                          :label="opt.label"
                          :value="opt.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="入山日期" prop="entryDate">
                      <el-date-picker
                        v-model="plan.entryDate"
                        type="date"
                        placeholder="選擇日期"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="離開日期" prop="exitDate">
                      <el-date-picker
                        v-model="plan.exitDate"
                        type="date"
                        placeholder="選擇日期"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="submitPlan"
                    :loading="submittingPlan"
                  >
                    建立隊伍
                  </el-button>
                  <el-button @click="resetPlan">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>

          <div class="info-section">
            <StepsPanel
              :title="'入山步驟'"
              :steps="[
                { title: '填寫基本資料', desc: '完成領隊個人資料與聯絡方式' },
                { title: '建立隊伍', desc: '設定隊名、人數、行程日期與主路線' },
                { title: '隊員入隊申請', desc: '邀請隊員加入並完成審核' },
              ]"
              :current-index="1"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
  <!-- 在最下方 template 外加入 QR Code 對話框 -->
  <el-dialog v-model="qrDialogVisible" title="自動帶入 QRCode" width="520px">
    <div style="text-align: center">
      <img
        v-if="qrData.qrCode"
        :src="qrData.qrCode"
        alt="QRCode"
        style="max-width: 320px; width: 100%"
      />
      <p style="margin-top: 8px; color: #ef4444; font-weight: bold">
        QR Code 於 {{ countdownDisplay }} 後失效
      </p>
    </div>
    <template #footer>
      <el-button @click="qrDialogVisible = false">關閉</el-button>
    </template>
  </el-dialog>
  <!-- 隊伍建立成功彈窗 -->
  <el-dialog
    v-model="successDialogVisible"
    title="隊伍建立成功"
    width="520px"
    :close-on-press-escape="false"
    :close-on-click-modal="true"
    :show-close="true"
    @closed="handleSuccessDialogClosed"
  >
    <div>
      <p style="font-size: 16px; margin-bottom: 10px">【{{ successData.teamName }}】建立成功</p>
      <p style="font-size: 16px; margin: 0">
        隊伍代號：
        <span style="color: #ef4444; font-weight: 700">{{ successData.teamCode }}</span>
      </p>
    </div>
    <template #footer>
      <el-button type="primary" @click="closeSuccessDialog">確定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import AppIcon from "../components/AppIcon.vue";
import PersonalInfoFields from "../components/PersonalInfoFields.vue";
import StepsPanel from "../components/StepsPanel.vue";
import { requestAutoFillResult } from "../services/issuer.js";
import { createTeam } from "../services/teams.js";
import { checkIdNumberInDateRange, checkTeamNameExists } from "../services/backend.js";
import { routes } from "../services/options.js";

// QR Code 彈窗管理
import { watch, onUnmounted } from "vue";
const qrDialogVisible = ref(false);
const qrData = reactive({ transactionId: "", qrCode: "", deepLink: "" });
const currentTransactionId = ref("");
let pollingTimer = null;
const countdownSeconds = ref(300);
const countdownTimer = ref(null);
const countdownDisplay = ref("05:00");

const showQrDialog = (res) => {
  qrData.transactionId = res?.transactionId || "";
  qrData.qrCode = res?.qrcodeImage || "";
  qrData.deepLink = res?.deepLink || "";
  qrDialogVisible.value = true;
  startCountdown();
  if (currentTransactionId.value) {
    startPolling(currentTransactionId.value);
  }
};

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
function updateCountdownDisplay() {
  const m = Math.floor(countdownSeconds.value / 60);
  const s = countdownSeconds.value % 60;
  countdownDisplay.value = `${String(m).padStart(2, "0")}:${String(s).padStart(
    2,
    "0"
  )}`;
}
function startPolling(transactionId) {
  stopPolling();
  pollingTimer = setInterval(async () => {
    try {
      const res = await requestAutoFillResult(transactionId);
      // 當後端回應已取得資料時（假設回傳有 data 或 status 標記）
      if (res && (res.data || res.status === "ready")) {
        const d = res.data || res;
        // 對應後端欄位填入領隊表單（做防呆）
        leader.name = d.name ?? leader.name;
        leader.phone = d.phone ?? leader.phone;
        leader.address = d.address ?? leader.address;
        leader.mobile = d.mobile ?? leader.mobile;
        leader.email = d.email ?? leader.email;
        leader.idNumber = d.idNumber ?? leader.idNumber;
        leader.gender = d.gender ?? leader.gender;
        leader.birthday = d.birthday ?? leader.birthday;
        leader.emergencyName = d.emergencyName ?? leader.emergencyName;
        leader.emergencyPhone = d.emergencyPhone ?? leader.emergencyPhone;
        stopPolling();
        ElMessage.success("已自動帶入領隊資料");
      }
    } catch (e) {
      // 輪詢錯誤時略過，持續下次輪詢；必要時可加上逾時機制
    }
  }, 1000);
}
function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}
watch(qrDialogVisible, (visible) => {
  if (!visible) {
    stopCountdown();
    stopPolling();
  }
});
onUnmounted(() => {
  stopCountdown();
  stopPolling();
});

// 隊伍建立成功彈窗狀態
const successDialogVisible = ref(false);
const successData = reactive({ teamName: "", teamCode: "" });

function buildTeamCode() {
  const d = new Date();
  const yyyy = d.getFullYear().toString();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const datePart = `${yyyy}${mm}${dd}`;

  const array = new Uint16Array(1);
  crypto.getRandomValues(array);
  const randomPart = String(array[0] % 10000).padStart(4, "0");
  return `${datePart}${randomPart}`;
}

// 領隊資料
const leaderRef = ref();
const leader = reactive({
  name: "",
  phone: "",
  fax: "",
  address: "",
  mobile: "",
  email: "",
  idNumber: "",
  gender: "",
  birthday: "",
  emergencyName: "",
  emergencyPhone: "",
});
const leaderRules = {
  name: [{ required: true, message: "請輸入姓名", trigger: "blur" }],
  // phone 非必填
  address: [{ required: true, message: "請輸入通訊地址", trigger: "blur" }],
  mobile: [
    { required: true, message: "請輸入手機", trigger: "blur" },
    { pattern: /^09\d{8}$/, message: "手機號碼格式不正確", trigger: "blur" },
  ],
  email: [
    { required: true, message: "請輸入 Email", trigger: "blur" },
    { type: "email", message: "Email 格式不正確", trigger: "blur" },
  ],
  idNumber: [
    { required: true, message: "請輸入身分證字號", trigger: "blur" },
    {
      pattern: /^[A-Z][0-9]{9}$/i,
      message: "身分證格式不正確",
      trigger: "blur",
    },
  ],
  gender: [{ required: true, message: "請選擇性別", trigger: "change" }],
  birthday: [{ required: true, message: "請選擇生日", trigger: "change" }],
  emergencyName: [
    { required: true, message: "請輸入緊急聯絡人", trigger: "blur" },
  ],
  emergencyPhone: [
    { required: true, message: "請輸入緊急聯絡電話", trigger: "blur" },
    { pattern: /^09\d{8}$/, message: "手機號碼格式不正確", trigger: "blur" },
  ],
};

// 依身分證第2碼自動設定性別（1=男 male，2=女 female）
watch(
  () => leader.idNumber,
  (val) => {
    if (typeof val === "string" && /^[A-Z][0-9]{9}$/i.test(val)) {
      const secondChar = val.charAt(1);
      if (secondChar === "1") {
        leader.gender = "male";
      } else if (secondChar === "2") {
        leader.gender = "female";
      }
    }
  }
);

// 登山計畫
const planRef = ref();
const submittingPlan = ref(false);
const plan = reactive({
  teamName: "",
  groupSize: 1,
  entryDate: "",
  exitDate: "",
  mainRoute: "",
});
const planRules = {
  teamName: [{ required: true, message: "請輸入隊名", trigger: "blur" }],
  groupSize: [{ required: true, message: "請輸入人數", trigger: "change" }],
  entryDate: [{ required: true, message: "請選擇入山日期", trigger: "change" }],
  exitDate: [{ required: true, message: "請選擇離開日期", trigger: "change" }],
  mainRoute: [{ required: true, message: "請輸入主路線", trigger: "blur" }],
};

const submitPlan = async () => {
  try {
    await leaderRef.value.validate();
    await planRef.value.validate();
    
    // 檢查隊名是否重複
    const isTeamNameDuplicate = checkTeamNameExists(plan.teamName);
    
    if (isTeamNameDuplicate) {
      ElMessage.error("建立隊伍失敗：隊名已存在，請使用其他隊名");
      return;
    }
    
    // 檢查是否有重複報名
    const isDuplicate = checkIdNumberInDateRange(
      leader.idNumber,
      plan.entryDate,
      plan.exitDate,
      plan.mainRoute
    );
    
    if (isDuplicate) {
      ElMessage.error("此身分證字號已重複報名該日期區間相同路線");
      return;
    }
    
    submittingPlan.value = true;
    // 先產生隊伍代號，並一併存入後端
    successData.teamName = plan.teamName;
    successData.teamCode = buildTeamCode();
    const payload = {
      leader: { ...leader },
      plan: { ...plan },
      teamCode: successData.teamCode,
      createdAt: new Date().toISOString(),
      members: [],
    };
    await createTeam(payload);
    successDialogVisible.value = true;
  } catch (e) {
    ElMessage.error("請先完成必填欄位");
  } finally {
    submittingPlan.value = false;
  }
};

const resetPlan = () => {
  leaderRef.value?.resetFields();
  planRef.value?.resetFields();
  Object.assign(leader, {
    name: "",
    phone: "",
    address: "",
    mobile: "",
    email: "",
    idNumber: "",
    gender: "",
    birthday: "",
    emergencyName: "",
    emergencyPhone: "",
  });
  Object.assign(plan, {
    teamName: "",
    groupSize: 1,
    entryDate: "",
    exitDate: "",
    mainRoute: "",
  });
};

const closeSuccessDialog = () => {
  successDialogVisible.value = false;
};

const handleSuccessDialogClosed = () => {
  resetPlan();
  successData.teamName = "";
  successData.teamCode = "";
};
</script>

<style scoped>
.team-creation-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.header-content h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.header-content p {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.main-content {
  padding: 60px 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.form-card {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.card-header h2 {
  margin: 0;
  color: #2c3e50;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.info-card {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

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
  background: #27ae60;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
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

.features-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.feature-item h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.feature-item p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.tip-item p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .page-header {
    padding: 60px 0;
  }

  .header-content h1 {
    font-size: 2rem;
  }

  .main-content {
    padding: 40px 0;
  }
}
</style>
