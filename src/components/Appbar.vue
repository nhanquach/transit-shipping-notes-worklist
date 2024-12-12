<script setup lang="ts">
</script>

<template>
    <v-app-bar flat density="compact" color="background-darken-1">
        <template v-slot:prepend>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title class="text-body-1">
            <v-breadcrumbs density="compact" :items="['HOME', 'TRANSIT SHIPPING NOTES WORKLIST']">
                <template v-slot:divider>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                </template>
            </v-breadcrumbs>
        </v-app-bar-title>

        <template v-slot:append>
            <v-text-field placeholder="Type here to search" prepend-inner-icon="mdi-magnify" min-width="200"
                :hide-details="true"></v-text-field>
            <v-btn icon="mdi-history"></v-btn>

            <v-btn icon="mdi-source-branch"></v-btn>

            <v-btn icon="mdi-bell"></v-btn>

            <v-badge dot color="green">
                <v-avatar color="white" background-color="white" variant="outlined">
                    <v-btn rounded="circle" color="green-lighten-2" variant="flat" min-height="100%" min-width="100%">
                        <span class="text-white">JA</span>
                    </v-btn>
                </v-avatar>
            </v-badge>
        </template>
    </v-app-bar>
</template>