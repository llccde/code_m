<script setup lang="ts">
import { useFileStore } from '@/m_data';
console.log(useFileStore().folderStructure)
</script>
<template>
    <div style="background-color: rgb(from var(--bg-color) calc(r*1.5) calc(g*1.2) calc(b*1.3));width: 100%;height: 100%;">
        <div style="font-size: larger;color: var(--text-color);">
            PS E:\node\electron\code_m>
        </div>
        <slot>

        </slot>
    </div>
</template>
