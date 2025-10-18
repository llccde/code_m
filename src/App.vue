<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import CodeView from './components/CodeView.vue'
import ResizeBar from './components/ResizeBar.vue'
</script>
<style scoped>
    .head{
        width: 100%;
        height: 100px;
        background-color: rgb(136, 136, 136);
    }
    #page-root{
        position: relative;
        width: 100%;
        height: 100%;
        

    }
    .layer{
        position: absolute;
        top: 0;
        left: 0;
    }
</style>
<template>
    <div id="page-root">
        <div id="resize-bars" class="layer">

        </div>
        <div id="pages" class="layer">
            
        </div>
    </div>
</template>


