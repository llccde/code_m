<script setup lang="ts">
import { inject, type Ref, ref, onMounted, onUnmounted } from 'vue';

const style = inject<Ref<string>>("currentStyle");
const styles = inject<Ref<Array<string>>>("styles");
const setCodeStyle = inject<(index:number)=>void>("setCodeStyle");


const showDropdown = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);


const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};


const selectStyle = (index: number) => {
  if (setCodeStyle) {
    setCodeStyle(index);
  }
  
};


const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
};


onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<template>
  <div class="com_root">
    <div class="nav-content">
      <div class="logo-section">
        <h2 class="logo" >code-M</h2>
      </div>
      <div class="controls-section">
        <div class="dropdown-container" ref="dropdownRef">
          <button class="style-toggle-btn" @click="toggleDropdown">
            <span>{{ style }}</span>
            <span class="dropdown-arrow">{{showDropdown?'▼':'◀'}}</span>
          </button>
          
          <div v-if="showDropdown" class="dropdown-menu">
            <div 
              v-for="(styleName, index) in styles" 
              :key="index"
              class="dropdown-item"
              :class="{ active: style === styleName }"
              @click="selectStyle(index)"
            >
              {{ styleName }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.com_root{
  background-color: rgb(from var(--bg-color) calc(r*0.8) calc(g*0.8) calc(b*0.8));
  height: 50px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo-section {
  flex: 1;
}

.logo {
  color: #333;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 900;
  color: var(--accent-color);
}

.controls-section {
  display: flex;
  align-items: center;
}

.dropdown-container {
  position: relative;
}

.style-toggle-btn {
  width: 150px;
  display: flex;
  justify-content: center;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgb(from var(--bg-color) calc(r*1.5) calc(g*1.5) calc(b*1.5));
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 10px;
  color: var(--text-color);
  cursor: pointer;
  font-size: 0.9rem;
}

.dropdown-arrow {
  font-size: 0.7rem;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background-color: var(--bg-color);
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 150px;
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.dropdown-item {
  padding: 8px 12px;
  color: var(--text-color);
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: var(--bg-color);
}

.dropdown-item.active {
  background-color: rgb(from var(--bg-color) calc(r*1.2) calc(g*1.2) calc(b*1.2));
  font-weight: bold;
  border: 2px solid var(--accent-color);
}
</style>