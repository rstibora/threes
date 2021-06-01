<template>
    <div v-clicked-outside="clickedOutsideCallback">
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

            // It seems element that is v-ifed ouf ot existence does not register for .contains
            // event test.
            ignoreClickedOutsideCallback: false,
        }
    },
    methods: {
        makeEditable() {
            this.changedText = this.modelValue
            this.beingEdited = true

            this.ignoreClickedOutsideCallback = true
            setTimeout(() => this.ignoreClickedOutsideCallback = false, 10)
        },
        makeNonEditable(save: boolean) {
            this.beingEdited = false
            if (save) {
                this.$emit("update:modelValue", this.changedText)
            }
            this.changedText = this.modelValue

            this.ignoreClickedOutsideCallback = false
        },
        clickedOutsideCallback() {
            if (this.ignoreClickedOutsideCallback) {
                return
            }

            if (this.beingEdited) {
                this.makeNonEditable(false)
            }
        }
    }
})
</script>
