import db from "../../db.json";

/**
 * 檢查 idNumber 是否在其他隊伍中存在，且日期區間有重疊，且同一路線
 * @param {string} idNumber - 身分證字號
 * @param {string} startDate - 開始日期 (YYYY-MM-DD 或 ISO 格式)
 * @param {string} endDate - 結束日期 (YYYY-MM-DD 或 ISO 格式)
 * @param {string} mainRoute - 主路線
 * @returns {boolean} - 如果找到相同 idNumber、相同 mainRoute 且日期區間重疊的隊伍則返回 true，否則返回 false
 */
export function checkIdNumberInDateRange(idNumber, startDate, endDate, mainRoute) {
  if (!idNumber || !startDate || !endDate || !mainRoute) {
    return false;
  }

  // 將日期字串轉換為 Date 物件以便比較
  const payloadStart = new Date(startDate);
  const payloadEnd = new Date(endDate);

  // 搜尋所有包含該 idNumber 的隊伍（在 leader.idNumber 或 members 陣列中）
  const conflictingTeams = db.teams.filter((team) => {
    const isLeader = team.leader?.idNumber === idNumber;
    const isMember = Array.isArray(team.members) && team.members.includes(idNumber);
    
    if (!isLeader && !isMember) {
      return false;
    }

    // 檢查路線是否相同
    const teamMainRoute = team.plan?.mainRoute;
    if (teamMainRoute !== mainRoute) {
      return false;
    }

    // 檢查該隊伍的日期區間是否與 payload 的日期區間重疊
    const teamEntryDate = team.plan?.entryDate;
    const teamExitDate = team.plan?.exitDate;

    if (!teamEntryDate || !teamExitDate) {
      return false;
    }

    const teamStart = new Date(teamEntryDate);
    const teamEnd = new Date(teamExitDate);

    // 兩個日期區間重疊的條件：start1 <= end2 && start2 <= end1
    const hasDateOverlap = payloadStart <= teamEnd && teamStart <= payloadEnd;
    
    return hasDateOverlap;
  });

  return conflictingTeams.length > 0;
}

// 搜尋身分證所在隊伍
export function searchTeamByIdNumber(idNumber) {
  const team = db.teams.find(
    (team) =>
      team.leader?.idNumber === idNumber || 
      (Array.isArray(team.members) && team.members.includes(idNumber))
  );
  return team;
}

/**
 * 檢查隊伍加入新成員後是否會超過人數上限
 * @param {string} teamCode - 隊伍代號
 * @returns {boolean} - 如果加入新成員後會超過上限則返回 true，否則返回 false
 */
export function checkTeamSize(teamCode) {
  const team = db.teams.find((team) => team.teamCode === teamCode);
  if (!team) {
    return false;
  }
  return team.plan?.groupSize === team?.members.length + 1;
}

/**
 * 計算 teams 中不重複的身分證字號數量（包含領隊和隊員）
 * @returns {number} - 不重複的身分證字號數量
 */
export function countValidHikers() {
  const idNumberSet = new Set();

  db.teams.forEach((team) => {
    // 收集領隊的身分證字號
    if (team.leader?.idNumber) {
      idNumberSet.add(team.leader.idNumber);
    }

    // 收集隊員的身分證字號
    if (Array.isArray(team.members)) {
      team.members.forEach((idNumber) => {
        if (idNumber) {
          idNumberSet.add(idNumber);
        }
      });
    }
  });

  return idNumberSet.size;
}

/**
 * 回傳 db.json 中 teams 的數量
 * @returns {number} - teams 的數量
 */
export function getTeamsCount() {
  return Array.isArray(db.teams) ? db.teams.length : 0;
}

/**
 * 檢查隊名是否已存在
 * @param {string} teamName - 隊名
 * @returns {boolean} - 如果隊名已存在則返回 true，否則返回 false
 */
export function checkTeamNameExists(teamName) {
  if (!teamName) {
    return false;
  }
  
  // 檢查是否有相同的隊名（不區分大小寫）
  const existingTeam = db.teams.find(
    (team) => team.plan?.teamName?.toLowerCase() === teamName.toLowerCase()
  );
  
  return !!existingTeam;
}