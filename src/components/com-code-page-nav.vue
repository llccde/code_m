<script setup lang="ts">
    import nav_button from './nav_button.vue';
    import { openedFilesStore } from './coedEditor';
    const opens = openedFilesStore();
    if(opens.openedFiles){}
</script>
<template>
    <div class="com-root">
        <div style="font-size: larger;color: tomato;display:  flex;height: 100%;">
            <div v-for="v in opens.openedFiles">
                <nav_button :file="v.value"></nav_button>
            </div>
        </div>
    </div>
</template>
<style lang="css" scoped>
    .com-root{
        width: 100%;
        height: 100%;
        background-color:  rgb(from var(--bg-color) calc(r*0.9) calc(g*0.9) calc(b*0.9));
    }
</style>