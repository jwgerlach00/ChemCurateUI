<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <v-autocomplete label="Organisms" :loading="organismLoading" :items="organismItems" v-model="organismSelect"
          v-model:search="organismSearch" color="black" chips multiple hide-details clearable/>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <v-autocomplete v-if="organismSelect.length" label="Proteins" placeholder="Type to reveal selections" :loading="proteinLoading"
          :items="proteinItems" v-model="proteinSelect" v-model:search="proteinSearch" color="black" chips multiple
          hide-details clearable/>
      </v-col>
      <!-- <v-col>
        <v-btn v-if="proteinSelect.length" color="green-accent-2">Submit</v-btn>
      </v-col> -->
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <v-btn v-if="proteinSelect.length" color="green-accent-2" block>Submit</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from 'axios'
import { ref, watch } from 'vue'
import { API_URL } from '@/main.js'

const organismLoading = ref(false)

const organismItems = ref([]) // Display names (formatted by API)

const organismSearch = ref(null)
const organismSelect = ref([])

const proteinLoading = ref(false)
const proteinItems = ref([])
const proteinSearch = ref(null)
const proteinSelect = ref([])

getOrganisms()

function getOrganisms () {
  axios.get(`${API_URL}/get_organisms`).then((res) => {
    organismItems.value = res.data
  }).catch((error) => {
    console.log(error)
  })
}

watch(organismSearch, (val) => {
  val && val !== organismSelect && queryOrganismSelections(val)
})

watch(proteinSearch, (val) => {
  val && val !== proteinSelect && queryProteinSelections(val)
})

function queryOrganismSelections (val) {
  organismLoading.value = true
  axios.post(`${API_URL}/query_organism_selections`, { query: val }).then((res) => {
    organismItems.value = res.data
    organismLoading.value = false
  }).catch((error) => {
    console.log(error)
  })
}

function queryProteinSelections (val) {
  proteinLoading.value = true
  axios.post(`${API_URL}/query_protein_selections`, { query: val, organism: organismSelect.value[0] }).then((res) => {
    proteinItems.value = res.data
    proteinLoading.value = false
  }).catch((error) => {
    console.log(error)
  })
}
</script>

<style scoped>
button.v-btn {
  height: 60px;
}
</style>
