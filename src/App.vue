<template>
  <v-app>
    <v-main>
      <Appbar />
      <v-card class="pa-4">
        <!-- TODO: Extract to a component -->
        <v-tabs v-model="tab" slider-color="transparent" class="ga-3">
          <v-tab :value="1" rounded="t-lg" border="sm" variant="flat" color="grey-darken-3" class="mx-1">
            Pinned (4)
            <template v-slot:append>
              <v-btn icon="mdi-close" variant="text" size="small" density="compact"></v-btn>
            </template>
            <template v-slot:prepend>
              <v-btn icon="mdi-pin" color="primary" variant="text" size="small" density="compact"></v-btn>
            </template>
          </v-tab>
          <v-tab :value="2" rounded="t-lg" border="sm" variant="flat" color="grey-darken-3" class="mx-1">Transit
            Notes</v-tab>
          <v-tab :value="3" rounded="t-lg" border="sm" variant="flat" color="grey-darken-3" class="mx-1">Drafts</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item :value="1">
            <h2>Pinned</h2>
          </v-tabs-window-item>
          <v-tabs-window-item :value="2">
            <p v-if="error" style="white-space: pre-line;">{{ error }}</p>
            <v-sheet class="d-flex align-center">
              Advanced search <v-checkbox :hide-details="true" />
            </v-sheet>
            <v-form>
              <v-row>
                <v-col cols="6" md="2">
                  <v-text-field v-model="shippingNoteReference" label="Shipping Note Reference"
                    placeholder="Enter value" variant="underlined" required></v-text-field>
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
            <v-data-table :search="shippingNoteReference" filter-keys="reference" :loading="loading" :items="items"
              :items-per-page="pagination.size" :headers="headers" fixed-header item-key="id" hide-default-footer>
              <template v-slot:top>
                <div class="d-flex align-center justify-space-between">
                  <v-btn prepend-icon="mdi-plus" variant="tonal" color="primary">
                    Create new shipping note
                  </v-btn>
                  <v-sheet class="d-flex align-center">
                    Size <v-select variant="solo" :hide-details="true" :items="[10, 20, 50, 100]" width="80"
                      :model-value="10" />
                    <span>
                      {{ pagination.page + 1 }} - {{ pagination.page * pagination.size + pagination.size }} of {{
                        pagination.totalElements }}
                    </span>
                    <v-pagination density="compact" :length="pagination.totalPages" :total-visible="6"
                      active-color="primary" :page="pagination.page"></v-pagination>
                    <v-btn icon="mdi-chevron-double-right" variant="flat" />
                    <v-btn icon="mdi-order-bool-descending-variant" variant="flat" />
                  </v-sheet>
                  <!-- <v-data-table-footer items-per-page-text="$vuetify.dataTable.itemsPerPageText" /> -->
                </div>
              </template>
              <template v-slot:item.actions>
                <v-sheet class="d-flex">
                  <v-btn icon="mdi-dots-horizontal" size="sm" slim></v-btn>
                  <v-btn icon="mdi-bookmark-outline" size="sm" slim></v-btn>
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

const tab = ref(2)
const items = ref([])
const loading = ref(false)
const error = ref('')

const headers = [
  {
    key: 'actions',
    sortable: false,
    minWidth: '50',
    disableSort: true,
  },
  {
    key: 'reference',
    title: 'Shipping Note Reference',
    minWidth: '240',
  },
  { key: 'status', title: 'Status', align: 'center', minWidth: '200', sortable: false },
  { key: 'operation.name', title: 'Operation',minWidth: '200' },
  { key: 'principalName', title: 'Principle Name', minWidth: '200' },
  { key: 'officeDeparture.name', title: 'Departure Office', minWidth: '200' },
  { key: 'submittedDate', title: 'Submitted Date', minWidth: '200' },
  { key: 'departureDateTime', title: 'Departure Date', minWidth: '200' },
  { key: 'estimatedArrivalDate', title: 'Scheduled Date Time', minWidth: '200' },
];

const pagination = ref({
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
})

const shippingNoteReference = ref('')

fetch('https://api.jsonserve.com/L0Yu2N',
  { method: "GET", mode: 'cors', headers: { 'Content-Type': 'application/json', } })
  .then(res => res.json()).then(json => {
    items.value = json
  })
  .catch(e => {
    console.error(e)
    items.value = sampleData.content
    pagination.value = {
      page: sampleData.pageable.pageNumber,
      size: sampleData.pageable.pageSize,
      totalElements: sampleData.totalElements,
      totalPages: sampleData.totalPages,
    }
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

const  formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getUTCFullYear();

  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}

</script>
