<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <v-autocomplete label="Organisms" :loading="organismLoading" :items="organismItems" v-model="organismSelect"
          v-model:search="organismSearch" color="black" chips multiple hide-details clearable/>
      </v-col>
    </v-row>


    <div v-if="organismSelect.length">
      <v-row v-for="organism in organismSelect" dense :key="organism">
        <v-col cols="12">
          <v-autocomplete :label="`${organism} Proteins`" placeholder="Type to reveal selections"
            :loading="proteinLoading" :items="proteinItems[organism]" v-model="proteinSelect[organism]"
            v-model:search="proteinSearch[organism]" color="black" chips multiple hide-details clearable>
            <template v-slot:append-item>
              <div v-intersect="endIntersect"></div>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
    </div>


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
const proteinItems = ref({})
const proteinSearch = ref({})
const proteinSelect = ref({})

function getUniprotMap () {
  axios.get(`${API_URL}/get_uniprot_map`).then((res) => {
    uniprotMapObject = res.data
    console.log(res.data)
  }).catch((error) => {
    console.log(error)
  })
}

function endIntersect (entries, observer, isIntersecting) {
  if (isIntersecting) {
    proteinItems.value = queryFilter(uniprotMapObject[organismSelect.value[0]], 
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

watch(organismSelect, (val) => {
  for (let organism of val) {
    // li = li.concat(uniprotMapObject[organismSelect.value[organism]])
    proteinSelect.value[organism] = []
    proteinSearch.value[organism] = null
    console.log(uniprotMapObject[organism])
    console.log(queryFilter(uniprotMapObject[organism], val).slice(0, 10))
    // proteinItems.value[organism] = queryFilter(uniprotMapObject[organism], val).slice(0, 10)
  }
})

watch(organismSearch, (val) => {
  val && val !== organismSelect && queryOrganismSelections(val)
})

for (let organism in organismSelect.value) {
  watch(proteinSearch[organism], (val) => {
    val && val !== proteinSelect && queryProteinSelections(val, organism)
  })
  console.log(organism)
}

function queryOrganismSelections (val) {
  organismLoading.value = true
  organismItems.value = queryFilter(Object.keys(uniprotMapObject), val)
  organismLoading.value = false
}

function queryProteinSelections (val, organism) {
  proteinLoading.value = true
  // proteinItems.value = queryFilter(uniprotMapObject[organismSelect.value[organism]], val).slice(0, 10)
  proteinLoading.value = false
}
</script>

<style scoped>
button.v-btn {
  height: 60px;
}
</style>
