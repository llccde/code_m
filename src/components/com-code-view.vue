<script setup lang="ts">
    import CodeView from './CodeView.vue';
    import { useFileStore } from '@/m_data';
    import { openedFilesStore } from './coedEditor';
import { ref } from 'vue';
    const files = openedFilesStore();
    const block = ref("block")
    const none = ref("none")
</script>
<style lang="css" scoped>
    .com-root{
        width: 100%;
        height: 100%;
        position:absolute;
        left:0;
        right:0;
    }
</style>
<template>
    <div class="com-root">
        <template style="height: 100%;" v-for="p in files.openedPaths">
            <div style="width: 100%;height: 100%;"  :style="{display:p==files.currentPage?block:none}">
                <code-view :path="p" >

                </code-view>
            </div>
            
        </template>
        <slot>

        </slot>
    </div>
</template>
