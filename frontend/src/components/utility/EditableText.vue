<template>
    <div>
        <div v-if="beingEdited">
            <input v-model="changedText"/>
            <button @click="makeNonEditable(save=true)" class="button is-success">Save</button>
        </div>
        <div v-else @click="makeEditable()">
            <span>{{ modelValue }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
    props: {
        modelValue: {
            type: String,
            required: true,
        }
    },
    emits: ["update:modelValue"],
    data: function() {
        return {
            changedText: new String(),
            beingEdited: false,
        }
    },
    methods: {
        makeEditable() {
            this.changedText = this.modelValue
            this.beingEdited = true
        },
        makeNonEditable(save: boolean) {
            this.beingEdited = false
            if (save) {
                this.$emit("update:modelValue", this.changedText)
            }
            this.changedText = this.modelValue
        },
    }
})
</script>
