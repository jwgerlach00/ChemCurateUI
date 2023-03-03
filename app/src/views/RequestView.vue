<template>
  <v-container>
    <h1>RequestView</h1>
    <v-card height="600px">
      <v-row>
        <v-col cols="6">
          <UniprotQuery/>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import UniprotQuery from '@/components/UniprotQuery.vue'
</script>
