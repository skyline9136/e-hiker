<template>
  <div class="carousel-container">
    <div
      class="carousel"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(item, index) in carouselItems"
        :key="index"
        class="carousel-item"
        :class="{ active: index === currentIndex }"
      >
        <div class="carousel-image">
          <img :src="item.image" :alt="item.title" />
          <div class="carousel-overlay">
            <div class="carousel-content">
              <h2 class="carousel-title">{{ item.title }}</h2>
              <p class="carousel-description">{{ item.description }}</p>
              <el-button
                type="primary"
                size="large"
                @click="navigateToPage(item.link)"
              >
                <AppIcon :name="item.icon" :size="20" color="white" style="margin-right: 4px" />
                {{ item.buttonText }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 導航按鈕 -->
    <button class="carousel-btn prev" @click="prevSlide">
      <AppIcon name="ChevronLeft" :size="24" color="white" />
    </button>
    <button class="carousel-btn next" @click="nextSlide">
      <AppIcon name="ChevronRight" :size="24" color="white" />
    </button>

    <!-- 指示器 -->
    <div class="carousel-indicators">
      <button
        v-for="(item, index) in carouselItems"
        :key="index"
        class="indicator"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import AppIcon from "./AppIcon.vue";
import applyInfoImage from "../assets/apply-info.JPG";
import teamCreateImage from "../assets/team-create.jpg";
import teamJoinImage from "../assets/team-join.jpg";

const router = useRouter();
const currentIndex = ref(0);
let autoPlayInterval = null;

const carouselItems = ref([
  {
    title: "填寫基本資料",
    description: "獲得專屬的數位卡，享受輕量便捷的登山體驗",
    image: applyInfoImage,
    icon: "CreditCard",
    buttonText: "立即申請",
    link: "/fill-vcs",
  },
  {
    title: "隊伍建立",
    description: "創建您的登山隊伍，邀請志同道合的夥伴一起探險",
    image: teamCreateImage,
    icon: "Flag",
    buttonText: "建立隊伍",
    link: "/team-creation",
  },
  {
    title: "隊員入隊申請",
    description: "加入現有的登山隊伍，與其他山友一起享受登山樂趣",
    image: teamJoinImage,
    icon: "UserPlus",
    buttonText: "申請入隊",
    link: "/team-join",
  },
]);

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % carouselItems.value.length;
};

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + carouselItems.value.length) %
    carouselItems.value.length;
};

const goToSlide = (index) => {
  currentIndex.value = index;
};

const navigateToPage = (link) => {
  router.push(link);
};

const startAutoPlay = () => {
  autoPlayInterval = setInterval(nextSlide, 5000);
};

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 0 0 20px 20px;
}

.carousel {
  display: flex;
  height: 100%;
  transition: transform 0.6s ease-in-out;
}

.carousel-item {
  min-width: 100%;
  position: relative;
  height: 100%;
}

.carousel-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.carousel-item:hover .carousel-image img {
  transform: scale(1.05);
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-content {
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 0 20px;
}

.carousel-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-description {
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.carousel-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn.prev {
  left: 20px;
}

.carousel-btn.next {
  right: 20px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .carousel-container {
    height: 400px;
  }

  .carousel-title {
    font-size: 2rem;
  }

  .carousel-description {
    font-size: 1rem;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
  }

  .carousel-btn.prev {
    left: 10px;
  }

  .carousel-btn.next {
    right: 10px;
  }
}
</style>
