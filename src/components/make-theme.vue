<!-- make-theme.vue -->
<script setup lang="ts">
    import { inject, provide, ref, type Ref } from 'vue';
    
    // 定义主题配置
    const themes = ["dark", "colorful"] as const;
    type Theme = typeof themes[number];
    
    const current = ref<Theme>("dark");
    const currentCodeStyle= ref("dark-plus");
    const styles = ref(['nord',"dark-plus"]);
    const setCodeStyle=(index:number)=>{    
        var s= styles.value[index];
        if(!s){
            currentCodeStyle.value = styles.value[0] as string;
        }else{
            currentCodeStyle.value = s;
        }
        
    }
    // 设置主题的函数
    const setTheme = (name: Theme) => {
        if (themes.includes(name)) {
            current.value = name;
        }
    }
    
    // 提供主题相关功能给子组件
    provide("setTheme", setTheme);
    provide("currentTheme", current);
    provide("themes",themes);
    provide("setCodeStyle",setCodeStyle);
    provide("styles",styles);
    provide("currentStyle",currentCodeStyle)
</script>

<template>
    <div style="height: 100%; width: 100%;" :class="['theme-container', current]">
        <slot></slot>
    </div>
</template>

<style lang="css" scoped>
    .theme-container {
        transition: all 0.3s ease;
    }
    
    /* 暗色主题 */
    .theme-container.dark {
        --bg-color: rgb(42, 42, 42);
        --text-color: rgb(194, 194, 194);
        --border-color: rgb(151, 151, 151);
        --accent-color: rgb(0, 102, 255);
    }
    
    /* 彩色主题 */
    .theme-container.colorful {
        --bg-color: rgb(34, 34, 51);
        --text-color: rgb(205, 214, 244);
        --border-color: rgb(137, 180, 250);
        --accent-color: rgb(245, 194, 231);
    }
</style>