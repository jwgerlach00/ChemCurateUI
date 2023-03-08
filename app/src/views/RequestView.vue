<template>
  <v-container>
    <h1>RequestView</h1>
    <v-card height="300px" width="800px">
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
}
.v-col {
  padding: 40px;
}
</style>
