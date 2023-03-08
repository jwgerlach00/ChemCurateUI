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
        <v-autocomplete v-if="organismSelect.length" label="Proteins" placeholder="Type to reveal selections"
          :loading="proteinLoading" :items="proteinItems" v-model="proteinSelect" v-model:search="proteinSearch"
          color="black" chips multiple hide-details clearable>
          <template v-slot:append-item>
            <div v-intersect="endIntersect"></div>
          </template>
        </v-autocomplete>
      </v-col>
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

let uniprotMapObject = {}
getUniprotMap()

const organismLoading = ref(false)

const organismItems = ref(Object.keys(uniprotMapObject)) // Display names (formatted by API)

const organismSearch = ref(null)
const organismSelect = ref([])

const proteinLoading = ref(false)
const proteinItems = ref([])
const proteinSearch = ref(null)
const proteinSelect = ref([])

function getUniprotMap () {
  axios.get(`${API_URL}/get_uniprot_map`).then((res) => {
    uniprotMapObject = res.data
  }).catch((error) => {
    console.log(error)
  })
}

function endIntersect (entries, observer, isIntersecting) {
  if (isIntersecting) {
    proteinItems.value = queryFilter(Object.keys(uniprotMapObject[organismSelect.value[0]]['protein']), 
      proteinSearch.value).slice(0, proteinItems.value.length + 10)
  }
}

// function getOrganisms () {
//   axios.get(`${API_URL}/get_organisms`).then((res) => {
//     organismItems.value = res.data
//   }).catch((error) => {
//     console.log(error)
//   })
// }

function queryFilter(items, value) {
  return items.filter(function(e) {
    return (e || '').toLowerCase().indexOf((value || '').toLowerCase()) > -1;
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
  organismItems.value = queryFilter(Object.keys(uniprotMapObject), val)
  organismLoading.value = false
}

function queryProteinSelections (val) {
  proteinLoading.value = true
  proteinItems.value = queryFilter(Object.keys(uniprotMapObject[organismSelect.value[0]]['protein']), val).slice(0, 10)
  proteinLoading.value = false
}
</script>

<style scoped>
button.v-btn {
  height: 60px;
}
</style>
