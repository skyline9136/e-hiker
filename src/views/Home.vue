<template>
  <div class="home">
    <!-- 圖片輪播區域 -->
    <ImageCarousel />

    <!-- 功能卡片區域 -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2>主要功能</h2>
          <p>探索我們的三大核心服務，讓您的登山之旅更加精彩</p>
        </div>

        <div class="features-grid">
          <div class="feature-card" @click="navigateToPage('/fill-vcs')">
            <div class="feature-icon">
              <AppIcon name="CreditCard" :size="64" color="blue-500" />
            </div>
            <h3>填寫基本資料</h3>
            <p>
              獲得專屬的數位卡，享受輕量便捷的登山體驗
            </p>
            <div class="feature-arrow">
              <AppIcon name="ArrowRight" :size="20" color="blue-500" />
            </div>
          </div>

          <div class="feature-card" @click="navigateToPage('/team-creation')">
            <div class="feature-icon">
              <AppIcon name="Users" :size="64" color="green-500" />
            </div>
            <h3>隊伍建立</h3>
            <p>創建您的登山隊伍，邀請志同道合的夥伴一起探險，分享登山樂趣</p>
            <div class="feature-arrow">
              <AppIcon name="ArrowRight" :size="20" color="green-500" />
            </div>
          </div>

          <div class="feature-card" @click="navigateToPage('/team-join')">
            <div class="feature-icon">
              <AppIcon name="UserPlus" :size="64" color="purple-500" />
            </div>
            <h3>隊員入隊申請</h3>
            <p>加入現有的登山隊伍，與其他山友一起享受登山樂趣，建立友誼</p>
            <div class="feature-arrow">
              <AppIcon name="ArrowRight" :size="20" color="purple-500" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 我們的宗旨區域 -->
    <section class="mission-section">
      <div class="container">
        <div class="section-header">
          <h2>我們的宗旨</h2>
          <p>以數位科技重新定義登山體驗，讓每一次登山都更輕盈、更環保、更安全</p>
        </div>

        <div class="mission-grid">
          <div class="mission-card">
            <div class="mission-icon">
              <AppIcon name="Feather" :size="64" color="yellow-500" />
            </div>
            <h3>輕量化</h3>
            <ul class="mission-list">
              <li>數位化證件，告別實體紙本，無需再攜帶入山證、入園證、身分證等相關證件上山</li>
              <li>減輕背包重量，節省至少20公克，讓您多帶一包能量果膠</li>
            </ul>
          </div>

          <div class="mission-card">
            <div class="mission-icon">
              <AppIcon name="Leaf" :size="64" color="green-500" />
            </div>
            <h3>環保</h3>
            <ul class="mission-list">
              <li>完全數位化，無需列印一次性入山證、入園證</li>
              <li>避免實體證件遺失於山林中，降低環境破壞風險</li>
            </ul>
          </div>

          <div class="mission-card">
            <div class="mission-icon">
              <AppIcon name="Shield" :size="64" color="blue-500" />
            </div>
            <h3>個資隱蔽</h3>
            <ul class="mission-list">
              <li>保護個人隱私，無需將完整個資提供給陌生領隊</li>
              <li>報到時僅需出示必要資訊，有效保護個人隱私</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 統計數據區域 -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ formatNumber(stats.activeUsers) }}+</div>
            <div class="stat-label">活躍用戶</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ formatNumber(stats.teams) }}+</div>
            <div class="stat-label">登山隊伍</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ formatNumber(stats.mountains) }}+</div>
            <div class="stat-label">合作山岳</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">99%</div>
            <div class="stat-label">滿意度</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import AppIcon from "../components/AppIcon.vue";
import ImageCarousel from "../components/ImageCarousel.vue";
import { reactive } from "vue";
import { countValidHikers } from "../services/backend.js";
import { routes } from "../services/options.js";

const router = useRouter();

const navigateToPage = (path) => {
  router.push(path);
};

const baseHikers = countValidHikers();
const stats = reactive({
  activeUsers: baseHikers * 10,
  teams: baseHikers * 5,
  mountains: Array.isArray(routes) ? routes.length : 0,
});

function formatNumber(n) {
  try {
    return Number(n || 0).toLocaleString();
  } catch (_) {
    return String(n || 0);
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.features-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
}

.section-header p {
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature-card {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 15px;
}

.feature-card p {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 20px;
}

.feature-arrow {
  opacity: 0;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-arrow {
  opacity: 1;
  transform: translateX(5px);
}

.mission-section {
  padding: 80px 0;
  background: white;
}

.mission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  margin-top: 40px;
}

.mission-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.mission-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.mission-icon {
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
}

.mission-card h3 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 25px;
}

.mission-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.mission-list li {
  color: #6c757d;
  line-height: 1.8;
  margin-bottom: 15px;
  padding-left: 25px;
  position: relative;
}

.mission-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #27ae60;
  font-weight: bold;
  font-size: 1.2rem;
}

.mission-list li:last-child {
  margin-bottom: 0;
}

.stats-section {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  padding: 60px 0;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
}

.stat-item {
  padding: 20px;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  color: #f39c12;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1.1rem;
  color: #bdc3c7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .features-section {
    padding: 60px 0;
  }

  .section-header h2 {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .feature-card {
    padding: 30px 20px;
  }

  .mission-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .mission-card {
    padding: 30px 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  .stat-number {
    font-size: 2.5rem;
  }
}
</style>
