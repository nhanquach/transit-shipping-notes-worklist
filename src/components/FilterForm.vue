<template>
    <v-form>
        <v-row>
            <v-col cols="6" md="2">
                <v-text-field v-model="shippingNoteReference" label="Shipping Note Reference" placeholder="Enter value"
                    variant="underlined"></v-text-field>
            </v-col>
            <v-col cols="6" md="2">
                <v-select variant="underlined" item-title="label" item-value="value" chips label="Departure Office"
                    :items="departureOfficeOptions" multiple
                    :placeholder="`${departureOfficeOptions.length} items available`">
                </v-select>
            </v-col>
            <v-col cols="6" md="2">
                <v-select variant="underlined" item-title="label" clearable item-value="value" chips
                    label="Destination Office" :items="destinationOfficeOptions" multiple></v-select>
            </v-col>
            <v-col cols="6" md="2">
                <v-select variant="underlined" item-title="label" clearable item-value="value" chips label="Status"
                    :items="statusOptions" multiple></v-select>
            </v-col>
            <v-col cols="6" md="2">
                <v-btn icon="mdi-chevron-double-down" variant="tonal" rounded="lg" class="mx-1 boder-radius-8"></v-btn>
                <v-btn icon="mdi-filter-remove" variant="tonal" rounded="lg" class="mx-1 boder-radius-8"></v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

defineProps<{
    departureOfficeOptions: any[],
    destinationOfficeOptions: any[],
    statusOptions: any[],
}>()

const emit = defineEmits<{
    (e: 'update:shippingNoteReference', value: string): void,
}>()

const shippingNoteReference = ref('')

watch(shippingNoteReference, () => {
    updateShippingNoteReference(shippingNoteReference.value)
})

function updateShippingNoteReference(value: string) {
    shippingNoteReference.value = value
    emit('update:shippingNoteReference', value)
}

</script>
