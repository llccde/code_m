import { createHighlighter,type HighlighterGeneric} from "shiki";
import { defineStore } from "pinia";
import { type Ref,ref } from "vue";

const highlighter = defineStore("highlighter",()=>{
    const js:Ref<any> = ref(null);
    const isInitialized = ref(false);
    createHighlighter({
        themes: ['nord'],
        langs: ['javascript'],
    }).then(re=>{
        js.value=re;
        isInitialized.value = true;
    });
})