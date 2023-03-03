<template>
  <v-card>
    <v-container>
      <v-row dense>
        <v-col cols="2">
          <v-text-field label="UniProt ID" variant="solo" v-model="uniprotInput"/>
        </v-col>
        <v-col>
          <v-btn class="text-field-btn" color="green-accent-2" @click="appendUniprot()">Add</v-btn>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="2">
          <v-list v-if="uniprotList.length">
            <v-list-subheader>UniProt IDs</v-list-subheader>
            <v-list-item v-for="item in uniprotList" :key="item" :title="item"></v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const uniprotInput = ref('')
const uniprotList = ref([])

function appendUniprot () {
  if (!(uniprotList.value.includes(uniprotInput.value.toUpperCase()))) {
    uniprotList.value.push(uniprotInput.value.toUpperCase())
  }
  uniprotInput.value = ''
}
</script>

<style scoped>
/* div.v-card {
  width: 70vw;
  margin: auto;
} */
div.v-list {
  max-height: 200px;
  overflow-y: scroll;
  border-radius: 4px;
}
</style>
