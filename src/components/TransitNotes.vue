<template>
    <v-sheet min-height="100vh" class="pa-2">
        <p v-if="error" style="white-space: pre-line;">{{ error }}</p>
        <v-sheet color="transparent" class="d-flex align-center">
            Advanced search <v-checkbox :hide-details="true" />
        </v-sheet>
        <FilterForm :departureOfficeOptions="departureOfficeOptions"
            :destinationOfficeOptions="destinationOfficeOptions" :statusOptions="statusOptions"
            @update:shippingNoteReference="shippingNoteReference = $event" />
        <v-data-table class="flat" :search="shippingNoteReference" filter-keys="reference" :loading="loading"
            :items="items" :items-per-page="pagination.size" :headers="headers" fixed-header item-key="id"
            hide-default-footer>
            <template v-slot:top>
                <v-sheet class="d-flex align-center justify-space-between" color="transparent">
                    <v-btn prepend-icon="mdi-plus" color="indigo-darken-3">
                        Create new shipping note
                    </v-btn>
                    <v-sheet class="d-flex align-center" color="transparent">
                        Size <v-select variant="solo" :hide-details="true" :items="[10, 20, 50, 100]" width="80"
                            :model-value="10" />
                        <span>
                            {{ pagination.page + 1 }} - {{ pagination.page * pagination.size + pagination.size }} of {{
                                pagination.totalElements }}
                        </span>
                        <v-pagination density="compact" :length="pagination.totalPages" :total-visible="6"
                            :page="pagination.page">
                            <template v-slot:item="{ page, isActive, key, props }">
                                <v-btn :variant="isActive ? 'elevated' : 'flat'"
                                    :color="isActive ? 'indigo-darken-3' : ''" size="small" slim :key="key"
                                    :props="props" min-width="1rem">{{ page }}</v-btn>
                            </template>
                        </v-pagination>
                        <v-btn icon="mdi-chevron-double-right" variant="flat" />
                        <v-btn icon="mdi-order-bool-descending-variant" variant="flat" />
                    </v-sheet>
                </v-sheet>
            </template>
            <template v-slot:item.actions>
                <v-sheet class="d-flex">
                    <v-btn icon="mdi-dots-horizontal" size="small" variant="plain"></v-btn>
                    <v-btn icon="mdi-bookmark-outline" size="small" variant="plain"></v-btn>
                </v-sheet>
            </template>
            <template v-slot:item.status="{ value }">
                <v-chip :color="getColor(value)">
                    {{ value }}
                </v-chip>
            </template>
            <template v-slot:item.submittedDate="{ value }">
                {{ formatDate(value) }}
            </template>
            <template v-slot:item.departureDateTime="{ value }">
                {{ formatDate(value) }}
            </template>
            <template v-slot:item.estimatedArrivalDate="{ value }">
                {{ formatDate(value) }}
            </template>
        </v-data-table>
    </v-sheet>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { VDataTable } from 'vuetify/components'

import sampleData from '../assets/sample-data.json'
import FilterForm from './FilterForm.vue';

import type { Data } from '@/types/data';
import uniq from '@/utils/uniq';
import formatDate from '@/utils/date';

type ReadonlyHeaders = VDataTable['$props']['headers']

const loading = ref(false)
const error = ref('')
const data = ref<Data>()
const shippingNoteReference = ref('')

const headers: ReadonlyHeaders = [
    {
        key: 'actions',
        sortable: false,
        minWidth: '50',
    },
    {
        key: 'reference',
        title: 'Shipping Note Reference',
        minWidth: '240',
    },
    { key: 'status', title: 'Status', align: "center", minWidth: '200', sortable: false },
    { key: 'operation.name', title: 'Operation', minWidth: '200' },
    { key: 'principalName', title: 'Principle Name', minWidth: '200' },
    { key: 'officeDeparture.name', title: 'Departure Office', minWidth: '200' },
    { key: 'submittedDate', title: 'Submitted Date', minWidth: '200' },
    { key: 'departureDateTime', title: 'Departure Date', minWidth: '200' },
    { key: 'estimatedArrivalDate', title: 'Scheduled Date Time', minWidth: '200' },
];

const items = computed(() => {
    return data.value?.content || []
})

const pagination = computed(() => {
    return {
        page: data.value?.number || 1,
        size: data.value?.size || 10,
        totalElements: data.value?.totalElements || 0,
        totalPages: data.value?.totalPages || 0,
    }
})

async function fetchData() {
    try {
        const response = await fetch('https://api.jsonserve.com/L0Yu2N')
        const json = await response.json();
        data.value = json
    } catch (error) {
        console.error(error)
        data.value = sampleData
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await fetchData()
})

const departureOfficeOptions = computed(() => {
    return uniq(items.value?.map(item => ({ label: item.officeDeparture.name, value: item.officeDeparture.code })))
})

const destinationOfficeOptions = computed(() => {
    return uniq(
        items.value?.map(item => ({
            label: item.officeDestination.name,
            value: item.officeDestination.code,
        }))
    )
})

const statusOptions = computed(() => {
    return uniq(items.value?.map(item => ({
        label: item.status,
        value: item.status,
    })))
})

const statusToColorMap = {
    'PAID': 'green',
    'ARRIVED': 'green',
    'EXITED': 'green',
    'DEPARTED': 'amber',
    'LATE': 'red'
}

const getColor = (value: string) => {
    return statusToColorMap[value as keyof typeof statusToColorMap];
}
</script>