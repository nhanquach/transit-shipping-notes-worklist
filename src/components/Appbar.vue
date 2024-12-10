<script setup lang="ts"></script>

<template>
    <v-app-bar :elevation="0">
        <template v-slot:prepend>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>
            <v-breadcrumbs :items="['HOME', 'TRANSIT SHIPPING NOTES WORKLIST']"></v-breadcrumbs>
        </v-app-bar-title>

        <template v-slot:append>
            <v-text-field placeholder="Type here to search" prepend-inner-icon="mdi-magnify" min-width="200"></v-text-field>
            <v-btn icon="mdi-history"></v-btn>

            <v-btn icon="mdi-source-branch"></v-btn>

            <v-btn icon="mdi-bell"></v-btn>

            <v-badge dot>
                <v-avatar color="surface-variant">JA</v-avatar>
            </v-badge>
        </template>
    </v-app-bar>
</template>