<script setup lang="js">

import CodeView from './components/com-code-view.vue'
import BodyFileView from './components/com-body-fileView.vue'
import BodyToolBar from './components/com-body-toolBar.vue'
import CodePageNav from './components/com-code-page-nav.vue'    
import CodeRunOutput from './components/com-code-run-output.vue'
import ComHead from './components/com-head.vue'
import comBodyCodeViewAndNav from './components/com-body-codeView-and-nav.vue'
import ResizeBar from './components/ResizeBar.vue'
import { onMounted,computed } from 'vue'
import { ref } from 'vue'
import makeTheme from './components/make-theme.vue'
import toolShow from './components/tool-show.vue'
import comBodyThemeView from './components/com-body-themeView.vue'
const com_body_left_width=ref(300);
const com_code_run_output_hight=ref(200);
const change_body_left_width=(d)=>{
    com_body_left_width.value+=d;
    if(com_body_left_width.value<300){
        com_body_left_width.value=300;
    }
    if(com_body_left_width.value>0.8*document.body.clientWidth){
        com_body_left_width.value=0.8*document.body.clientWidth
    }
}
const change_output_hight=(d)=>{
    com_code_run_output_hight.value-=d;
    if(com_code_run_output_hight.value<120){
        com_code_run_output_hight.value=120;
    }
    if(com_code_run_output_hight.value>0.6*document.body.clientHeight){
        com_code_run_output_hight.value=0.6*document.body.clientHeight
    }
}
const theChoiceToolView=ref(0);
const choice = (id)=>{
    theChoiceToolView.value=id;
}
onMounted(()=>{
    console.log("App mounted");

})
</script>
<style scoped>
    .head{
        width: 100%;
        height: 100%;
        background-color: rgb(136, 136, 136);
    }
    .page-root{
        position: relative;
        width: 100%;
        height: 100%;
        max-width: none;
    }
    .components{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: rgb(168, 168, 168);
    }
    .com-head{
        width: 100%;
        height: 50px;
        background-color: rgb(132, 132, 132);
    }
    .com-body{
        display: flex;
        flex-direction: row;
        width: 100%;
        flex:1;
        background-color: rgb(182, 181, 181);
    }
    .com-body-left{
        display: flex;
        flex-direction: row;
        height: 100%;
        overflow:visible;
        background-color: rgb(175, 170, 159);
    }
    .com-body-toolBar{
        height: 100%;
        width: 60px;
        background-color: rgb(52, 52, 52)

    }
    .com-body-fileView{
        height: 100%;
        flex: 1;
        background-color: rgba(176, 159, 127, 0.82);
    }
    .com-body-right{
        display: flex;
        flex-direction: column;
        height: 100%;
        flex: 1;
        min-width: 0;
        background-color: rgb(137, 152, 152);
    }
    .com-body-codeView-and-nav{
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: 0;
        flex: 1;
        background-color: rgb(86, 141, 141);
    }
    .com-code-page-nav{
        display: flex;
        flex-direction: column;
        background-color: rgb(93, 124, 156);
        width: 100%;
        height: 35px;
    }
    .com-code-view{
        position: relative;
        width: 100%;
        flex: 1;
        min-height: 0;
        background-color:  rgb(from var(--bg-color) calc(r*1.3) calc(g*1.3) calc(b*1.3));
    }

    .com-code-run-output{
        width: 100%;
        height: 200px;
    }
</style>
<template>
    <div class="page-root">
        <makeTheme>
        <div class="components">
            <div class="com-head"  leaf="true">
                <ComHead></ComHead>
            </div>

            <div class="com-body" >
                <div class="com-body-left" :style="{width:com_body_left_width+'px'}" >
                    <div class="com-body-toolBar"  leaf="true">
                        <BodyToolBar @choiceToolView="choice"></BodyToolBar>
                    </div>
                    <div class="com-body-fileView" leaf="true">
                        <toolShow :pages="2" :choice="theChoiceToolView">
                            <template v-slot:s0>
                                <BodyFileView></BodyFileView>
                            </template>
                            <template v-slot:s1>
                                <comBodyThemeView>   
                                </comBodyThemeView>
                            </template>
                        </toolShow>
                    </div>    
                    <ResizeBar @be_drag="change_body_left_width" :verticalDrag="false" style="width: 2px;min-width: 5px;z-index: 1000;;height: 100%;cursor: e-resize;"></ResizeBar>
                </div>
                <div class="com-body-right" >
                    <comBodyCodeViewAndNav class="com-body-codeView-and-nav" >
                        <div class="com-code-page-nav" leaf="true">
                            <CodePageNav></CodePageNav>
                        </div>
                        <div class="com-code-view" leaf="true">
                            <CodeView></CodeView>
                        </div>
                    </comBodyCodeViewAndNav>
                    <ResizeBar @be_drag="change_output_hight" :verticalDrag="true" style="width: 100%;min-height: 5px;z-index: 1000;;height: 4px;cursor: n-resize;"></ResizeBar>
                    <div class="com-code-run-output" :style="{height:com_code_run_output_hight+'px'}" leaf="true">
                        <CodeRunOutput></CodeRunOutput>
                    </div>
                </div>
            </div>
        </div>
        </makeTheme>
    </div>
</template>
