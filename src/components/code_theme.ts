import { createHighlighter,type HighlighterGeneric,type BundledLanguage,type BundledTheme} from "shiki";
import { defineStore } from "pinia";
import { type Ref,ref } from "vue";

export const highlighter = defineStore("highlighter",()=>{
    const light:Ref<HighlighterGeneric<BundledLanguage, BundledTheme>|null> = ref(null);
    const isInitialized = ref(false);
    createHighlighter({
        themes: ['nord','dark-plus'],
        langs: ['javascript','python',"js","py",'txt','md'],
    }).then(re=>{
        light.value=re;
        isInitialized.value = true;
    });
    return {light,isInitialized}
})


