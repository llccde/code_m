<script setup lang="ts">
</script>
<template>
    <div class="com_root">
        <div style="font-size: larger;color: tomato;">
            
        </div>
        <slot>

        </slot>
    </div>
</template>
<style lang="css" scoped>
    .com_root{
        background-color: rgb(from var(--bg-color) calc(r*0.8) calc(g*0.8) calc(b*0.8));
        height: 100%;
        border-bottom: 1px solid rgb(110, 110, 110) ;
    }
</style>
