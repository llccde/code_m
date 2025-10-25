<script setup lang="ts">
</script>
<template>
    <div class="com_root">
        <div style="font-size: larger;color: tomato;">
            head component
        </div>
        <slot>

        </slot>
    </div>
</template>
<style lang="css" scoped>
    .com_root{
        background-color: rgb(42, 42, 42);
        height: 100%;
        border-bottom: 1px solid rgb(110, 110, 110) ;
    }
</style>
