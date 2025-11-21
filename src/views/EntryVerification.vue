<template>
  <div class="entry-verification-page">
    <div class="backdrop">
      <img src="/src/assets/checkpoint.png" alt="checkpoint" />
    </div>
    <div class="content">
      <!-- <el-card class="qr-card">
        <template #header>
          <div class="card-header">
            <AppIcon name="ShieldCheck" :size="28" color="green-500" />
            <h2>入山驗證</h2>
          </div>
        </template> -->
      <QrPanel
        ref="qrRef"
        :show-countdown="true"
        :show-regenerate-button="false"
        api-mode="verify"
        @success="onSuccess"
      />
      <!-- <div style="text-align:center; margin-top: 10px">
          <el-button type="primary" @click="start">開始驗證</el-button>
        </div>
      </el-card> -->
    </div>

    <!-- 報到結果彈窗 -->
    <el-dialog
      v-model="successDialogVisible"
      :title="isSuccess ? '報到成功!' : '報到失敗'"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="success-content">
        <el-icon
          :size="60"
          :color="isSuccess ? '#67c23a' : '#f56c6c'"
          style="margin-bottom: 20px"
        >
          <Check v-if="isSuccess" />
          <Close v-else />
        </el-icon>
        <template v-if="isSuccess">
          <div class="info-list">
            <p v-if="userInfo.userName" class="info-item">
              <strong>姓名：</strong>{{ userInfo.userName }}
            </p>
            <p v-if="userInfo.teamName" class="info-item">
              <strong>隊名：</strong>{{ userInfo.teamName }}
            </p>
            <p v-if="userInfo.groupSize" class="info-item">
              <strong>人數：</strong>{{ userInfo.groupSize }}
            </p>
            <p v-if="userInfo.entryDate" class="info-item">
              <strong>入山日期：</strong>{{ userInfo.entryDate }}
            </p>
            <p v-if="userInfo.exitDate" class="info-item">
              <strong>離開日期：</strong>{{ userInfo.exitDate }}
            </p>
            <p v-if="userInfo.mainRoute" class="info-item">
              <strong>主路線：</strong>{{ userInfo.mainRoute }}
            </p>
          </div>
        </template>
        <template v-else>
          <p class="info-item">未找到相關隊伍資訊</p>
        </template>
      </div>
      <template #footer>
        <el-button v-if="!isSuccess" @click="successDialogVisible = false"
          >關閉</el-button
        >
        <el-button
          v-if="!isSuccess"
          type="primary"
          @click="handleRegenerateQrCode"
          >重新產生Qrcode</el-button
        >
        <el-button
          v-if="isSuccess"
          type="primary"
          @click="successDialogVisible = false"
          >確定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { Check, Close } from "@element-plus/icons-vue";
import AppIcon from "../components/AppIcon.vue";
import QrPanel from "../components/QrPanel.vue";
import { searchTeamByIdNumber } from "../services/backend.js";

const qrRef = ref();
const successDialogVisible = ref(false);
const userInfo = ref({
  userName: "",
  teamName: "",
  groupSize: "",
  entryDate: "",
  exitDate: "",
  mainRoute: "",
});

const isSuccess = computed(() => {
  // 主要判断是否有队伍信息，有队伍名表示找到队伍
  return !!userInfo.value.teamName;
});

function extractIdNumberFromOidvpData(data) {
  // 解析 OIDVP 結果，提取身分證字號
  const list = Array.isArray(data?.data) ? data.data : [];
  for (const item of list) {
    const type = item.credentialType;
    const claims = item.claims || [];
    for (const c of claims) {
      const { ename, value } = c;
      if (type === "00000000_roc_id_card" && ename === "id_number") {
        return value;
      }
    }
  }
  return null;
}

function extractNameFromOidvpData(data) {
  // 解析 OIDVP 結果，提取姓名
  const list = Array.isArray(data?.data) ? data.data : [];
  for (const item of list) {
    const type = item.credentialType;
    const claims = item.claims || [];
    for (const c of claims) {
      const { ename, value } = c;
      if (type === "00000000_digital_business_card" && ename === "name") {
        return value;
      }
    }
  }
  return null;
}

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (e) {
    return dateString;
  }
}

function start() {
  qrRef.value?.start();
}

async function onSuccess(data) {
  // 取得 OIDVP 結果，提取身分證字號和姓名
  const idNumber = extractIdNumberFromOidvpData(data);
  const name = extractNameFromOidvpData(data);

  // 搜尋隊伍資訊
  let team = null;
  if (idNumber) {
    team = searchTeamByIdNumber(idNumber);
  }

  // 設定使用者資訊
  userInfo.value = {
    userName: name || team?.leader?.name || "",
    teamName: team?.plan?.teamName || "",
    groupSize: team?.plan?.groupSize ? String(team.plan.groupSize) : "",
    entryDate: formatDate(team?.plan?.entryDate) || "",
    exitDate: formatDate(team?.plan?.exitDate) || "",
    mainRoute: team?.plan?.mainRoute || "",
  };

  // 顯示彈窗
  successDialogVisible.value = true;
}

function handleRegenerateQrCode() {
  successDialogVisible.value = false;
  qrRef.value?.start();
}
</script>

<style scoped>
.entry-verification-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}
.backdrop {
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
}
.backdrop img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.9);
}
.content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.qr-card {
  width: 420px;
  max-width: 90vw;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.card-header h2 {
  margin: 0;
  color: #2c3e50;
}
.success-content {
  text-align: center;
  padding: 20px 0;
}
.success-content .el-icon {
  display: block;
  margin: 0 auto 20px;
}
.info-list {
  text-align: left;
  margin-top: 20px;
}
.info-item {
  margin: 12px 0;
  font-size: 16px;
  color: #f56c6c;
  text-align: center;
}
.info-item strong {
  color: #606266;
  margin-right: 8px;
}
</style>
