<script setup lang="ts">
import { useFileStore } from '@/m_data';
console.log(useFileStore().folderStructure)
</script>
<template>
    <div>
        <div style="font-size: larger;color: tomato;">
            com-code-run-output
        </div>
        <slot>

        </slot>
    </div>
</template>
