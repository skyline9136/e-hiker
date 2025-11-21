<template>
  <div class="fill-vcs-page">
    <!-- 頁面標題區域 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1>填寫基本資料</h1>
          <p>請填寫數位身分證、個人數位名片與緊急聯絡卡資訊</p>
        </div>
      </div>
    </section>

    <!-- 主要內容區域 -->
    <section class="main-content">
      <div class="container">
        <div class="content-grid">
          <!-- 表單區域 -->
          <div class="form-section">
            <!-- 申請數位身分證 -->
            <el-collapse v-model="activeCards" class="form-card-collapse">
              <el-collapse-item name="idCard" :title="''">
                <template #title>
                  <div class="card-header">
                    <AppIcon name="IdCard" :size="32" color="blue-500" />
                    <h2>申請數位身分證</h2>
                  </div>
                </template>
                <el-card class="form-card" :body-style="{ padding: '20px' }">

              <el-form
                ref="idCardFormRef"
                :model="idCardForm"
                :rules="idCardRules"
                label-width="120px"
                size="large"
              >
                <el-form-item label="姓名" prop="name">
                  <el-input
                    v-model="idCardForm.name"
                    placeholder="請輸入姓名"
                  />
                </el-form-item>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="身分證字號" prop="idNumber">
                      <el-input
                        v-model="idCardForm.idNumber"
                        placeholder="請輸入身分證字號"
                        maxlength="10"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="出生年月日" prop="rocBirthday">
                      <el-input
                        v-model="idCardForm.rocBirthday"
                        placeholder="請輸入民國年YYYMMDD（7碼）"
                        maxlength="7"
                        @input="handleRocBirthdayInput"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="戶籍地址" prop="registered_address">
                  <el-input
                    v-model="idCardForm.registered_address"
                    placeholder="請輸入戶籍地址"
                  />
                </el-form-item>

                <el-form-item>
                  <el-button
                    type="primary"
                    @click="submitIdCard"
                    :loading="submittingIdCard"
                    size="large"
                  >
                    <AppIcon name="Send" :size="20" color="white" style="margin-right: 4px" />
                    提交身分證申請
                  </el-button>
                  <el-button @click="resetIdCard" size="large">重置</el-button>
                </el-form-item>
              </el-form>
                </el-card>
              </el-collapse-item>
            </el-collapse>
            <!-- 申請個人數位名片 -->
            <el-collapse v-model="activeCards" class="form-card-collapse" style="margin-top: 30px">
              <el-collapse-item name="personal" :title="''">
                <template #title>
                  <div class="card-header">
                    <AppIcon name="WalletCards" :size="32" color="orange-500" />
                    <h2>申請個人數位名片</h2>
                  </div>
                </template>
                <el-card class="form-card" :body-style="{ padding: '20px' }">

              <el-form
                ref="personalFormRef"
                :model="personalForm"
                :rules="personalRules"
                label-width="120px"
                size="large"
              >
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                      <el-input
                        v-model="personalForm.name"
                        placeholder="請輸入姓名"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="手機" prop="phoneNumber">
                      <el-input
                        v-model="personalForm.phoneNumber"
                        placeholder="請輸入手機號碼"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="電話" prop="tel">
                      <el-input
                        v-model="personalForm.tel"
                        placeholder="請輸入電話"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="傳真" prop="fax">
                      <el-input
                        v-model="personalForm.fax"
                        placeholder="請輸入傳真"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="Email" prop="email">
                  <el-input
                    v-model="personalForm.email"
                    placeholder="請輸入電子信箱"
                  />
                </el-form-item>

                <el-form-item label="通訊地址" prop="contactAddress">
                  <el-input
                    v-model="personalForm.contactAddress"
                    placeholder="請輸入通訊地址"
                  />
                </el-form-item>

                <el-form-item>
                  <el-button
                    type="primary"
                    @click="submitPersonal"
                    :loading="submittingPersonal"
                    size="large"
                  >
                    <AppIcon name="Send" :size="20" color="white" style="margin-right: 4px" />
                    提交名片申請
                  </el-button>
                  <el-button @click="resetPersonal" size="large"
                    >重置</el-button
                  >
                </el-form-item>
              </el-form>
                </el-card>
              </el-collapse-item>
            </el-collapse>

            <!-- 申請緊急聯絡卡 -->
            <el-collapse v-model="activeCards" class="form-card-collapse" style="margin-top: 30px">
              <el-collapse-item name="emergency" :title="''">
                <template #title>
                  <div class="card-header">
                    <AppIcon name="ShieldAlert" :size="32" color="red-500" />
                    <h2>申請緊急聯絡卡</h2>
                  </div>
                </template>
                <el-card class="form-card" :body-style="{ padding: '20px' }">

              <el-form
                ref="emergencyFormRef"
                :model="emergencyForm"
                :rules="emergencyRules"
                label-width="140px"
                size="large"
              >
                <el-form-item label="緊急聯絡人" prop="emergencyContactName">
                  <el-input
                    v-model="emergencyForm.emergencyContactName"
                    placeholder="請輸入緊急聯絡人姓名"
                  />
                </el-form-item>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      label="緊急聯絡人電話"
                      prop="emergencyContactNumber"
                    >
                      <el-input
                        v-model="emergencyForm.emergencyContactNumber"
                        placeholder="請輸入聯絡電話"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="關係" prop="relationship">
                      <el-input
                        v-model="emergencyForm.relationship"
                        placeholder="例如：父母、朋友、同事"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item>
                  <el-button
                    type="primary"
                    @click="submitEmergency"
                    :loading="submittingEmergency"
                    size="large"
                  >
                    <AppIcon name="Send" :size="20" color="white" style="margin-right: 4px" />
                    提交聯絡卡申請
                  </el-button>
                  <el-button @click="resetEmergency" size="large"
                    >重置</el-button
                  >
                </el-form-item>
              </el-form>
                </el-card>
              </el-collapse-item>
            </el-collapse>
          </div>

          <!-- 本頁資訊 -->
          <div class="info-section">
            <StepsPanel
              :title="'入山步驟'"
              :steps="[
                { title: '填寫基本資料', desc: '完成領隊個人資料與聯絡方式' },
                { title: '建立隊伍', desc: '設定隊名、人數、行程日期與主路線' },
                { title: '隊員入隊申請', desc: '邀請隊員加入並完成審核' },
              ]"
              :current-index="0"
            />
          </div>
          <!-- <div class="info-section">
            <el-card class="info-card">
              <template #header>
                <h3>必要數位卡申請</h3>
              </template>
              <div class="required-cards-list">
                <div class="card-item">
                  <div class="card-icon">
                    <AppIcon name="IdCard" :size="24" color="blue-500" />
                  </div>
                  <div class="card-content">
                    <h4>申請數位身分證</h4>
                    <p>填寫身分證資料並送出申請</p>
                  </div>
                </div>
                <div class="card-item">
                  <div class="card-icon">
                    <AppIcon name="WalletCards" :size="24" color="orange-500" />
                  </div>
                  <div class="card-content">
                    <h4>申請個人數位名片</h4>
                    <p>填寫基本資料並送出申請</p>
                  </div>
                </div>
                <div class="card-item">
                  <div class="card-icon">
                    <AppIcon name="ShieldAlert" :size="24" color="red-500" />
                  </div>
                  <div class="card-content">
                    <h4>申請緊急聯絡卡</h4>
                    <p>填寫緊急聯絡資訊並送出申請</p>
                  </div>
                </div>
              </div>
            </el-card>
          </div> -->
        </div>
      </div>
    </section>
  </div>

  <CredentialQrPanel
    v-model="issuePanel.visible"
    :title="issuePanel.title"
    :transactionId="issuePanel.transactionId"
    :qr-code="issuePanel.qrCode"
    @success="handleIssueSuccess"
  />
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import AppIcon from "../components/AppIcon.vue";
import { issueCredential } from "../services/issuer.js";
import StepsPanel from "../components/StepsPanel.vue";
import CredentialQrPanel from "../components/CredentialQrPanel.vue";

// 卡片展開/收合狀態
const activeCards = ref(["idCard", "personal", "emergency"]);
const VCUID_ID_CARD = "00000000_roc_id_card";
const VCUID_PERSONAL =
  import.meta.env.VITE_BUSINESS_CARD_REF || "00000000_digital_business_card";
const VCUID_EMERGENCY =
  import.meta.env.VITE_EMERGENCY_CONTACT_CARD_REF || "00000000_emergency_contact_card";

// 數位身分證表單
const idCardFormRef = ref();
const submittingIdCard = ref(false);
const idCardForm = reactive({
  name: "",
  idNumber: "",
  rocBirthday: "",
  registered_address: "",
});

const idCardRules = {
  name: [{ required: true, message: "請輸入姓名", trigger: "blur" }],
  idNumber: [
    { required: true, message: "請輸入身分證字號", trigger: "blur" },
    {
      pattern: /^[A-Z][0-9]{9}$/i,
      message: "身分證格式不正確",
      trigger: "blur",
    },
  ],
  rocBirthday: [
    { required: true, message: "請輸入出生年月日", trigger: "blur" },
    {
      pattern: /^\d{7}$/,
      message: "出生年月日格式不正確，請輸入7碼數字（YYYMMDD）",
      trigger: "blur",
    },
  ],
  registered_address: [
    { required: true, message: "請輸入戶籍地址", trigger: "blur" },
  ],
};

const handleRocBirthdayInput = (value) => {
  // 只允許輸入數字
  idCardForm.rocBirthday = value.replace(/\D/g, "");
};

const submitIdCard = async () => {
  try {
    await idCardFormRef.value.validate();
    submittingIdCard.value = true;
    const payload = buildPayload("id-card", [
      { ename: "name", content: idCardForm.name },
      { ename: "id_number", content: idCardForm.idNumber },
      { ename: "roc_birthday", content: idCardForm.rocBirthday },
      { ename: "registered_address", content: idCardForm.registered_address },
    ]);
    const res = await issueCredential(payload);
    openIssuePanel("idCard", "數位身分證 QR Code", res);
    ElMessage.success("數位身分證申請已提交");
  } catch (error) {
    ElMessage.error("身分證表單驗證失敗，請檢查輸入");
  } finally {
    submittingIdCard.value = false;
  }
};

const resetIdCard = () => {
  idCardFormRef.value?.resetFields();
  Object.assign(idCardForm, {
    name: "",
    idNumber: "",
    rocBirthday: "",
    registered_address: "",
  });
};

// 個人數位名片表單
const personalFormRef = ref();
const submittingPersonal = ref(false);
const personalForm = reactive({
  name: "",
  phoneNumber: "",
  tel: "",
  fax: "",
  email: "",
  contactAddress: "",
});

const personalRules = {
  name: [{ required: true, message: "請輸入姓名", trigger: "blur" }],
  phoneNumber: [
    { required: true, message: "請輸入手機號碼", trigger: "blur" },
    { pattern: /^09\d{8}$/, message: "手機號碼格式不正確", trigger: "blur" },
  ],
  tel: [],
  fax: [],
  email: [
    { required: true, message: "請輸入電子信箱", trigger: "blur" },
    { type: "email", message: "電子信箱格式不正確", trigger: "blur" },
  ],
  contactAddress: [
    { required: true, message: "請輸入通訊地址", trigger: "blur" },
  ],
};

const submitPersonal = async () => {
  try {
    await personalFormRef.value.validate();
    submittingPersonal.value = true;
    const payload = buildPayload("personal-card", [
      { ename: "name", content: personalForm.name },
      { ename: "phoneNumber", content: personalForm.phoneNumber },
      { ename: "tel", content: personalForm.tel },
      { ename: "fax", content: personalForm.fax },
      { ename: "email", content: personalForm.email },
      { ename: "contactAddress", content: personalForm.contactAddress },
    ]);
    const res = await issueCredential(payload);
    openIssuePanel("personal", "個人數位名片 QR Code", res);
    ElMessage.success("個人數位名片申請已提交");
  } catch (error) {
    ElMessage.error("名片表單驗證失敗，請檢查輸入");
  } finally {
    submittingPersonal.value = false;
  }
};

const resetPersonal = () => {
  personalFormRef.value?.resetFields();
  Object.assign(personalForm, {
    name: "",
    phoneNumber: "",
    tel: "",
    fax: "",
    email: "",
    contactAddress: "",
  });
};

// 緊急聯絡卡表單
const emergencyFormRef = ref();
const submittingEmergency = ref(false);
const emergencyForm = reactive({
  emergencyContactName: "",
  emergencyContactNumber: "",
  relationship: "",
});

const emergencyRules = {
  emergencyContactName: [
    { required: true, message: "請輸入緊急聯絡人", trigger: "blur" },
  ],
  emergencyContactNumber: [
    { required: true, message: "請輸入緊急聯絡人電話", trigger: "blur" },
    { pattern: /^09\d{8}$/, message: "手機號碼格式不正確", trigger: "blur" },
  ],
  relationship: [{ required: true, message: "請輸入關係", trigger: "blur" }],
};

const submitEmergency = async () => {
  try {
    await emergencyFormRef.value.validate();
    submittingEmergency.value = true;
    const payload = buildPayload("emergency-card", [
      {
        ename: "emergencyContactName",
        content: emergencyForm.emergencyContactName,
      },
      {
        ename: "emergencyContactNumber",
        content: emergencyForm.emergencyContactNumber,
      },
      { ename: "relationship", content: emergencyForm.relationship },
    ]);
    const res = await issueCredential(payload);
    openIssuePanel("emergency", "緊急聯絡卡 QR Code", res);
    ElMessage.success("緊急聯絡卡申請已提交");
  } catch (error) {
    ElMessage.error("緊急聯絡卡表單驗證失敗，請檢查輸入");
  } finally {
    submittingEmergency.value = false;
  }
};

const resetEmergency = () => {
  emergencyFormRef.value?.resetFields();
  Object.assign(emergencyForm, {
    emergencyContactName: "",
    emergencyContactNumber: "",
    relationship: "",
  });
};

// 共用：發證 QR 面板狀態
const issuePanel = reactive({
  visible: false,
  title: "",
  transactionId: "",
  qrCode: "",
  collapseName: "",
});

function openIssuePanel(collapseName, title, res) {
  issuePanel.title = title;
  issuePanel.transactionId = res?.transactionId || "";
  issuePanel.qrCode = res?.qrCode || "";
  issuePanel.collapseName = collapseName;
  issuePanel.visible = true;
}

function handleIssueSuccess() {
  // 收起對應卡片
  if (issuePanel.collapseName) {
    activeCards.value = activeCards.value.filter((n) => n !== issuePanel.collapseName);
  }
  issuePanel.visible = false;
}

function buildPayload(kind, fields) {
  const now = new Date();
  const issuanceDate = formatDateYYYYMMDD(now);
  const expiredDate = formatDateYYYYMMDD(addDays(now, 40));
  let vcUid;
  if (kind === "id-card") {
    vcUid = VCUID_ID_CARD;
  } else if (kind === "personal-card") {
    vcUid = VCUID_PERSONAL;
  } else {
    vcUid = VCUID_EMERGENCY;
  }
  return {
    vcUid,
    // issuanceDate,
    // expiredDate,
    fields,
  };
}

function addDays(date, days) {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

function pad2(n) {
  return n.toString().padStart(2, "0");
}

function formatDateYYYYMMDD(d) {
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
}

function formatTimeHHmm(d) {
  return `${pad2(d.getHours())}${pad2(d.getMinutes())}`;
}

onMounted(() => {
  console.log("Mount onMounted");
});
// no local countdown anymore; handled by CredentialQrPanel
</script>

<style scoped>
.fill-vcs-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
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

.form-card-collapse {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
}

.form-card-collapse :deep(.el-collapse-item__header) {
  padding: 0 20px;
  height: auto;
  min-height: 70px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.form-card-collapse :deep(.el-collapse-item__wrap) {
  border-bottom: none;
}

.form-card-collapse :deep(.el-collapse-item__content) {
  padding: 0;
}

.form-card {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  min-width: 0;
  flex: 1;
}

.card-header h2 {
  margin: 0;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
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

.required-cards-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.card-item:hover {
  background: #e9ecef;
}

.card-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.card-content p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.benefit-item h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.benefit-item p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
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
  background: #3498db;
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
