<template>
    <div class="modal is-active">
        <div @click="$emit('closed')" class="modal-background"></div>
        <div class="modal-content">
            <div class="box">
                <div class="field">
                    <label class="label">Duration</label>
                    <div class="control">
                        <input v-model="editedEffort.duration" class="input" type="number">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Date and Time</label>
                    <div class="control">
                        <input v-model="editedEffort.duration" class="input" type="number">
                    </div>
                </div>
                <div class="field">
                    <div class="control">
                        <button @click="updateOrCreateEffort" class="button">Save Effort Details</button>
                        <!-- <span v-if="failed" class="has-text-danger">Something went wrong.</span> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"

import { Effort, NewEffort } from "src/network/models/effort"
import { useEffortsStore } from "src/state/effortsStore"


function getEditedEffort(effortOrTaskId: Effort | number): Effort | NewEffort {
    if (effortOrTaskId instanceof Effort) {
        return effortOrTaskId
    }
    return new NewEffort(effortOrTaskId, 0, "")
}

export default defineComponent({
    props: {
        effortOrTaskId: {
            type: Object as PropType<Effort | number>,
            required: true
        }
    },
    setup(props) {
        const effortsStore = useEffortsStore()
        return { effortsStore } 
    },
    emits: ["closed"],
    data: function() {
        return {
            editedEffort: getEditedEffort(this.effortOrTaskId) as Effort | NewEffort
        }
    },
    methods: {
        async updateOrCreateEffort() {
            if (!(this.editedEffort instanceof Effort)) {
                await this.effortsStore.createEffort(this.editedEffort)
                this.$emit("closed")
            } else {
                await this.effortsStore.updateEffort(this.editedEffort)
                this.$emit("closed")
            }
        }
    }
})
</script>
