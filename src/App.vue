<template>
  <v-app>
    <Appbar />
    <v-main>
      <v-card class="pt-4" color="background-darken-1">
        <v-tabs v-model="tab" class="ml-4">
          <v-tab :hide-slider="true" :value="1" rounded="t-lg" variant="flat" class="mr-2" base-color="base-tab-color">
            Pinned (4)
            <template v-slot:append>
              <v-btn icon="mdi-close" variant="text" size="small" density="compact"></v-btn>
            </template>
            <template v-slot:prepend>
              <v-btn icon="mdi-pin" color="primary" variant="text" size="small" density="compact"></v-btn>
            </template>
          </v-tab>
          <v-tab :hide-slider="true" :value="2" rounded="t-lg" variant="flat" class="mr-2"
            base-color="base-tab-color">Transit
            Notes</v-tab>
          <v-tab :hide-slider="true" :value="3" rounded="t-lg" variant="flat" class="mr-2"
            base-color="base-tab-color">Drafts</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item :value="1">
            <v-sheet min-height="100vh">
              <h2>Pinned</h2>
            </v-sheet>
          </v-tabs-window-item>
          <v-tabs-window-item :value="2">
            <TransitNotes />
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
import { ref } from 'vue'

import TransitNotes from './components/TransitNotes.vue';

const tab = ref(2)
</script>
