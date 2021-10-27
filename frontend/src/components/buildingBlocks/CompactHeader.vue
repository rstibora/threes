<template>
<div class="compact-header">
    <slot/>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({})
</script>

<style lang="sass" scoped>
.compact-header
    position: sticky
    top: 0px
    min-height: 56px
    width: 100%
    margin-bottom: 10px

    background-color: white
    box-shadow: 0px 0px 5px gray
</style>
