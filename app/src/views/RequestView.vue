<template>
  <v-container>
    <h1>ChemCurate</h1>
    <v-card width="800px">
      <v-row>
        <v-col cols="12">
          <UniprotQuery/>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import UniprotQuery from '@/components/UniprotQuery.vue'
</script>

<style scoped>
div.v-card {
  margin: auto;
  min-height: 20vh;
  max-height: 70vh;
  overflow-y: auto;
}
.v-col {
  padding: 40px;
}
</style>
