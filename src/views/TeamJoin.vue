<template>
  <div class="team-creation-page">
    <!-- 頁面標題區域 -->
    <section class="page-header">
        <div class="container">
          <div class="header-content">
            <h1>隊員入隊申請</h1>
            <p>加入現有的登山隊伍，與其他山友一起享受登山樂趣</p>
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
                  <h2>加入隊伍</h2>
                </div>
              </template>
              <!-- 區塊：輸入個人資料 -->
              <h3 style="margin: 10px 0 0 0; color: #2c3e50">輸入個人資料</h3>
              <el-form
                ref="leaderRef"
                :model="leader"
                :rules="leaderRules"
                label-width="120px"
                size="large"
              >
                <PersonalInfoFields v-model="leader" :show-auto-fill="true" />
              </el-form>

              <!-- 區塊：隊伍資訊 -->
              <h3 style="margin: 20px 0 0 0; color: #2c3e50">隊伍資訊</h3>
              <el-form :model="joinForm" :rules="joinRules" label-width="120px" size="large">
                  <el-form-item label="隊伍代號" prop="teamCode">
                    <div style="display: flex; align-items: center; gap: 10px; width: 100%">
                      <el-input v-model="joinForm.teamCode" placeholder="請輸入隊伍代號" />
                      <el-button type="primary" @click="lookupTeam" :loading="lookingUp">查詢隊伍</el-button>
                    </div>
                  </el-form-item>
                  <!-- 第一列：隊名（獨佔一整列） -->
                  <el-row :gutter="20" v-if="lookupResult">
                    <el-col :span="24">
                      <el-form-item label="隊名">
                        <el-input :model-value="lookupResult.plan?.teamName || ''" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!-- 第二列：領隊姓名、隊伍人數 -->
                  <el-row :gutter="20" v-if="lookupResult">
                    <el-col :span="12">
                      <el-form-item label="領隊姓名">
                        <el-input :model-value="lookupResult.leader?.name || ''" disabled />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="隊伍人數">
                        <el-input
                          :model-value="`${(lookupResult.members?.length || 0) + 1} / ${lookupResult.plan?.groupSize || 0}`"
                          disabled
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!-- 第三列：入山日期、離開日期 -->
                  <el-row :gutter="20" v-if="lookupResult">
                    <el-col :span="12">
                      <el-form-item label="入山日期">
                        <el-input :model-value="formatDate(lookupResult.plan?.entryDate)" disabled />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="離開日期">
                        <el-input :model-value="formatDate(lookupResult.plan?.exitDate)" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!-- 最後一列：登山主路線（獨佔一整列） -->
                  <el-row :gutter="20" v-if="lookupResult">
                    <el-col :span="24">
                      <el-form-item label="登山主路線">
                        <el-input :model-value="lookupResult.plan?.mainRoute || ''" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item>
                    <el-button type="primary" @click="submitJoinApplication" :loading="submitting">加入隊伍</el-button>
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
              :current-index="2"
            />
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- 加入隊伍成功彈窗 -->
  <el-dialog
    v-model="successDialogVisible"
    title="加入隊伍成功"
    width="600px"
    :close-on-press-escape="false"
    :close-on-click-modal="true"
    :show-close="true"
  >
    <div class="success-content">
      <div class="success-message">
        <div style="display: flex; justify-content: center; margin-bottom: 20px">
          <AppIcon name="CheckCircle" :size="48" color="green-500" />
        </div>
        <h3 style="font-size: 20px; margin: 0 0 10px 0; color: #27ae60">恭喜！您已成功加入隊伍</h3>
        <p style="font-size: 16px; margin: 0 0 30px 0; color: #606266">隊伍代號：<span style="color: #ef4444; font-weight: 700">{{ successData.teamCode }}</span></p>
      </div>
      <div class="team-info" v-if="successData.team">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="隊名" :span="2">
            {{ successData.team.plan?.teamName || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="領隊姓名">
            {{ successData.team.leader?.name || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="隊伍人數">
            {{ (successData.team.members?.length || 0) + 1 }} / {{ successData.team.plan?.groupSize || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="入山日期">
            {{ formatDate(successData.team.plan?.entryDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="離開日期">
            {{ formatDate(successData.team.plan?.exitDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="登山主路線" :span="2">
            {{ successData.team.plan?.mainRoute || "-" }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="successDialogVisible = false">確定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch  } from "vue";
import { ElMessage } from "element-plus";
import AppIcon from "../components/AppIcon.vue";
import PersonalInfoFields from "../components/PersonalInfoFields.vue";
import StepsPanel from "../components/StepsPanel.vue";
import { getTeams, updateTeam } from "../services/teams.js";
import { checkIdNumberInDateRange, checkTeamSize } from "../services/backend.js";

const joinForm = reactive({
  teamCode: "",
});

const joinRules = {
  teamCode: [{ required: true, message: "請輸入隊伍代號", trigger: "blur" }],
};

// 查詢狀態與結果
const lookingUp = ref(false);
const lookupResult = ref(null);
const submitting = ref(false);

// 加入成功彈窗狀態
const successDialogVisible = ref(false);
const successData = reactive({
  teamCode: "",
  team: null,
});

// 監聽彈窗關閉，清空表單
watch(successDialogVisible, (newVal) => {
  if (!newVal) {
    // 彈窗關閉時清空表單
    handleDialogClose();
  }
});

// 格式化日期顯示
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

// 依 teamCode 查詢隊伍並代入表單：隊名、領隊姓名
async function lookupTeam() {
  if (!joinForm.teamCode) {
    ElMessage.warning("請先輸入隊伍代號");
    return;
  }
  try {
    lookingUp.value = true;
    const list = await getTeams({ teamCode: joinForm.teamCode });
    const team = Array.isArray(list) && list.length ? list[0] : null;
    if (!team) {
      lookupResult.value = null;
      ElMessage.error("找不到對應的隊伍");
      return;
    }
    lookupResult.value = team;
    ElMessage.success("已代入隊伍資訊");
  } catch (e) {
    ElMessage.error("查詢隊伍失敗");
  } finally {
    lookingUp.value = false;
  }
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


// 使用者輸入隊伍代碼後提交入隊申請：把身分證加入 teams.members
async function submitJoinApplication() {
  try {
    if (!joinForm.teamCode) {
      ElMessage.warning("請先輸入隊伍代號");
      return;
    }
    const idNumber = leader.idNumber?.trim();
    if (!idNumber) {
      ElMessage.error("請先填寫身分證字號");
      return;
    }
    submitting.value = true;
    const list = await getTeams({ teamCode: joinForm.teamCode });
    const team = Array.isArray(list) && list.length ? list[0] : null;
    if (!team) {
      ElMessage.error("查無此隊伍代號，請確認後再試");
      return;
    }
    
    // 檢查隊伍人數是否已達上限
    if (checkTeamSize(joinForm.teamCode)) {
      ElMessage.error("該隊伍人數已達上限");
      return;
    }
    
    // 檢查是否有重複報名
    const teamEntryDate = team.plan?.entryDate;
    const teamExitDate = team.plan?.exitDate;
    const teamMainRoute = team.plan?.mainRoute;
    
    if (teamEntryDate && teamExitDate && teamMainRoute) {
      const isDuplicate = checkIdNumberInDateRange(
        idNumber,
        teamEntryDate,
        teamExitDate,
        teamMainRoute
      );
      
      if (isDuplicate) {
        ElMessage.error("此身分證字號已重複報名該日期區間相同路線");
        return;
      }
    }
    
    const members = Array.isArray(team.members) ? team.members.slice() : [];
    if (!members.includes(idNumber)) {
      members.push(idNumber);
      await updateTeam(team.id, { members });
    }
    
    // 更新隊伍資訊並顯示成功彈窗
    const updatedTeam = { ...team, members };
    successData.teamCode = joinForm.teamCode;
    successData.team = updatedTeam;
    successDialogVisible.value = true;
  } catch (e) {
    ElMessage.error("提交失敗，請稍後再試");
  } finally {
    submitting.value = false;
  }
}

// 處理彈窗關閉，清空表單
function handleDialogClose() {
  // 清空個人資料表單
  leaderRef.value?.resetFields();
  Object.assign(leader, {
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
  // 清空隊伍資訊表單
  joinForm.teamCode = "";
  lookupResult.value = null;
}
</script>

<style scoped>
  .team-join-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
    background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
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

.success-content {
  padding: 20px 0;
}

.success-message {
  text-align: center;
  margin-bottom: 30px;
}

.team-info {
  margin-top: 20px;
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
