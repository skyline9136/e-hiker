import axios from "axios";

const ISSUER_API_BASE = import.meta.env.VITE_ISSUER_API_BASE;
const VERIFY_API_BASE = import.meta.env.VITE_VERIFY_API_BASE;
const ISSUER_ACCESS_TOKEN = import.meta.env.VITE_ISSUER_ACCESS_TOKEN;
const VERIFY_ACCESS_TOKEN = import.meta.env.VITE_VERIFY_ACCESS_TOKEN;
const OIDVP_REF =
  import.meta.env.VITE_APPLICATION_INFO_REF || "00000000_mountain_climbing_team";

const issuerApi = axios.create({
  baseURL: ISSUER_API_BASE,
  headers: {
    "Access-Token": ISSUER_ACCESS_TOKEN,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

const verifyApi = axios.create({
  baseURL: VERIFY_API_BASE,
  headers: {
    "Access-Token": VERIFY_ACCESS_TOKEN,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

// 發送申請數位卡的資料，並取得 VC QRCode（POST，payload: { ref, transactionId, data }）
export async function issueCredential(payload) {
  const { data } = await issuerApi.post("/qrcode/data", payload);
  return data;
}

// 取得 VC QRCode 掃描後結果
export async function requestCredentialResult(transactionId) {
  const { data } = await issuerApi.get(`/credential/nonce/${transactionId}`);
  return data;
}

// 取得代入個資的 QRCode（GET，參數以 query 帶入）
export async function requestAutoFillQr(transactionId) {
  const params = { ref: OIDVP_REF, transactionId };
  const { data } = await verifyApi.get("/oidvp/qrcode", { params });
  return data;
}

// 查詢掃完QRCode後的結果（POST，payload: { transactionId }）
export async function requestAutoFillResult(transactionId) {
  const { data } = await verifyApi.post("/oidvp/result", { transactionId });
  return data;
}

// 取得身分證驗證的 QRCode（GET，參數以 query 帶入）
export async function requestVerifyIdQr(transactionId) {
  const params = { ref: "00000000_verify_id", transactionId };
  const { data } = await verifyApi.get("/oidvp/qrcode", { params });
  return data;
}

// 查詢身分證驗證掃完QRCode後的結果（POST，payload: { transactionId }）
export async function requestVerifyIdResult(transactionId) {
  const { data } = await verifyApi.post("/oidvp/result", { transactionId });
  return data;
}
