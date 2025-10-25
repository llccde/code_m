<script setup lang="ts">
    import { inject,provide,ref,type Ref } from 'vue';
    import { openedFilesStore } from './coedEditor';

</script>
<template>
    <div>
        <slot>

        </slot>
    </div>
</template>