<template>
  <v-app>
    <v-main>
      <Appbar />
      <v-card>
        <v-tabs v-model="tab" color="deep-purple-accent-4">
          <v-tab :value="1">Pinned</v-tab>
          <v-tab :value="2">Transit Notes</v-tab>
          <v-tab :value="3">Drafts</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item :value="1">
            <h2>Pinned</h2>
          </v-tabs-window-item>
          <v-tabs-window-item :value="2">
            <p v-if="error" style="white-space: pre-line;">{{ error }}</p>
            <v-checkbox label="Advanced search"> Need to be rounded</v-checkbox>
            <v-form>
              <v-row>
                <v-col cols="6" md="2">
                  <v-text-field label="Shipping Note Reference" placeholder="Enter value" variant="underlined"
                    required></v-text-field>
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
                  <v-btn icon="mdi-chevron-double-down" variant="tonal" rounded="lg"
                    class="mx-1 boder-radius-8"></v-btn>
                  <v-btn icon="mdi-filter-remove" variant="tonal" rounded="lg" class="mx-1 boder-radius-8"></v-btn>
                </v-col>
              </v-row>
            </v-form>
            <v-data-table :loading="loading" :items="items" :items-per-page="2" :headers="headers" fixed-header
              show-select item-key="id">
              <template v-slot:top>
                <div class="d-flex align-center justify-space-between">
                  <v-btn prepend-icon="mdi-plus" variant="tonal" color="primary">
                    Create new shipping note
                  </v-btn>
                  <v-data-table-footer items-per-page-text="$vuetify.dataTable.itemsPerPageText" />
                </div>
              </template>
            </v-data-table>
            <v-data-footer />
          </v-tabs-window-item>
          <v-tabs-window-item :value="3">
            <h2>Drafts</h2>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import sampleData from './assets/sample-data.json'
import { ar } from 'vuetify/locale';

const tab = ref(2)
const items = ref([])
const loading = ref(false)
const error = ref('')

const headers = [
  {
    align: 'start',
    key: 'reference',
    sortable: false,
    title: 'Shipping Note Reference',
    minWidth: 200,
  },
  { key: 'status', title: 'Status' },
  { key: 'operation.name', title: 'Operation', minWidth: 200 },
  { key: 'principalName', title: 'Principle Name', minWidth: 200 },
  { key: 'officeDeparture.name', title: 'Departure Office', minWidth: 200 },
  { key: 'submittedDate', title: 'Submitted Date' },
  { key: 'departureDateTime', title: 'Departure Date' },
  { key: 'estimatedArrivalDate', title: 'Scheduled Date Time' },
];

fetch('https://api.jsonserve.com/L0Yu2N',
  { method: "GET", mode: 'cors', headers: { 'Content-Type': 'application/json', } })
  .then(res => res.json()).then(json => {
    items.value = json
  })
  .catch(e => {
    console.error(e)
    items.value = sampleData.content
  })
  .finally(() => {
    loading.value = false
  })

const uniq = (arr) => {
  return [...new Set(arr.map(item => JSON.stringify(item)))]
    .map((stringItem: string) => JSON.parse(stringItem))

};

const departureOfficeOptions = computed(() => {
  return uniq(items.value.map(item => ({ name: item.officeDeparture.name, code: item.officeDeparture.code })))
})

const destinationOfficeOptions = computed(() => {
  return uniq(
    items.value.map(item => ({
      label: item.officeDestination.name,
      value: item.officeDestination.code,
    }))
  )
})

const statusOptions = computed(() => {
  // TODO: Need to update in order to return Unique Status
  return uniq(items.value.map(item => ({
    label: item.status,
    value: item.status,
  })))
})


</script>
