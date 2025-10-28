<script lang="ts" setup>


    import { computed,ref,provide,type ComputedRef} from 'vue';
    import comBodyFileView from './com-body-fileView.vue';

    const p= defineProps({pages:Number,choice:Number})
    const range:ComputedRef<string[]> = computed(()=>{
        var t=[];
        for(var i=0;i<(p.pages as number);i++){
            t.push(`s${i}`);
        }
        return t;
    })
    const be_choice = computed(()=>{
        return p.choice!=undefined?`s${p.choice}`:"s0";
    });

</script>
<style>
    
</style>
<template>
    <div style="width: 100%;height: 100%;">
        <template v-for="name in range">
            <div style="width: 100%;height: 100%;" v-show="be_choice==name">
                <slot :name="name" >

                </slot>
            </div>
            
        </template>
    </div>
</template>