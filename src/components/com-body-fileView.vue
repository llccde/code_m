<script setup lang="ts">    
import FFItem from './FFItem.vue';
import { type Ref,ref,provide} from 'vue';
const closedTag:Map<string,Ref<boolean>> = new Map();
closedTag.set("",ref(false));
const setTag=(path:string,closeTag:boolean)=>{
    var a = closedTag.get(path);
    if(a){
        a.value = closeTag
    }else{
        closedTag.set(path,ref(closeTag))
    }
}
const fileViewApi  ={setTag,closedTag}
export type fileViewApiType = typeof fileViewApi;
provide("fileViewSetting",fileViewApi)





</script>
<style lang="css" scoped>
    .title {
        width: 100%;
        font-size: medium;
        border-bottom: 3px solid var(--border-color, black);
        padding: 8px 0 8px 7px;
        box-sizing: border-box;
    }
    .root-items{
        width: 100%;
        height: 100%;
        --tab-size:20px;
        color: rgb(127, 127, 127);
        background-color: var(--bg-color);
    }

</style>
<template>
    <div class="root-items" style="">
        <div class="title">
            文件浏览
        </div>
        <div style="padding-left: 7px;">
            <f-f-item path="" :depth=0>

            </f-f-item>
        </div>
        
    </div>
</template>
