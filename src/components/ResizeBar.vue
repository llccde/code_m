<script setup lang="ts">
    import { defineProps, ref, type Ref } from 'vue'
    const props = defineProps<{
        verticalDrag: boolean
    }>()
    const emit = defineEmits<{
        be_drag: [d: number]
    }>()

    const startRecord= (e:MouseEvent)=>{
        let lastMousePosition = {x:e.clientX,y:e.clientY};

        const m_mousemove=(e:MouseEvent)=>{
            let newMousePosition={x:e.clientX,y:e.clientY};
            if(props.verticalDrag){
                emit('be_drag',newMousePosition.y-lastMousePosition.y);
            }
            else{
                emit('be_drag',newMousePosition.x-lastMousePosition.x);
            }
            lastMousePosition=newMousePosition
        }
        const m_mouseup=()=>{
            removeEventListener("mousemove",m_mousemove);
            removeEventListener("mouseup",m_mouseup);
        }

        let id0=addEventListener("mousemove",m_mousemove)
        let id1= addEventListener("mouseup",m_mouseup)
    }


</script>
<style scoped>
    .resize-bar{
        background-color: rgb(92, 91, 91);
    }
</style>
<template>
    <div class="resize-bar" @mousedown="startRecord">

    </div>
</template>