import { createHighlighter,type HighlighterGeneric,type BundledLanguage,type BundledTheme} from "shiki";
import { defineStore } from "pinia";
import { type Ref,ref } from "vue";

export const highlighter = defineStore("highlighter",()=>{
    const js:Ref<HighlighterGeneric<BundledLanguage, BundledTheme>|null> = ref(null);
    const isInitialized = ref(false);
    createHighlighter({
        themes: ['nord'],
        langs: ['javascript'],
    }).then(re=>{
        js.value=re;
        isInitialized.value = true;
    });
    return {js,isInitialized}
})


