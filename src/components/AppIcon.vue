<template>
  <div class="flex items-center flex-nowrap">
    <component
      :is="icon"
      :name="$attrs.name"
      :size="$attrs.size"
      :strokeWidth="$attrs.strokeWidth ?? 2"
      :color="resolvedColor"
      class="cursor-pointer"
    />
    <span v-if="label" class="ml-1">
      {{ label }}
    </span>
  </div>
</template>

<script setup>
import * as icons from "lucide-vue-next";
import palette from "@/assets/color.js";
import { computed, useAttrs } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: false,
  },
});

const attrs = useAttrs();
const icon = computed(() => icons[attrs.name]);
const resolvedColor = computed(() => {
  if (!attrs.color) return undefined;
  if (attrs.color.includes("-")) {
    const [base, shade] = attrs.color.split("-");
    const group = palette[base];
    return group?.[+shade] || attrs.color;
  } else {
    return attrs.color;
  }
});
</script>

<style scoped>
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.flex-nowrap {
  flex-wrap: nowrap;
}

.ml-1 {
  margin-left: 0.25rem;
}
</style>
