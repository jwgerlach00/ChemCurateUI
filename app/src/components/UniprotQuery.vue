<template>
  <div>
    <v-autocomplete label="Organisms" :loading="organismLoading" :items="organismItems" v-model="organismSelect"
      v-model:search="organismSearch" chips multiple hide-details clearable color="black"/>
    <!-- <v-autocomplete label="Proteins" :loading="proteinLoading" :items="proteinItems" v-model="proteinSelect"
      v-model:search="proteinSearch" chips multiple hide-details clearable color="black"/> -->
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, watch } from 'vue'
import { API_URL } from '@/main.js'

const organismLoading = ref(false)
const organismItems = ref([])
const organismSearch = ref(null)
const organismSelect = ref(null)

const proteinLoading = ref(false)
const proteinItems = ref([])
const proteinSearch = ref(null)
const proteinSelect = ref(null)

get_organisms()

watch(organismSelect, (val) => {
  console.log(val)
  get_proteins()
})

function get_organisms () {
  axios.get(`${API_URL}/get_organisms`).then((res) => {
    organismItems.value = res.data
    console.log(organismItems.value)
    console.log(res.data)
  }).catch((error) => {
    console.log(error)
  })
}

function get_proteins () {
  axios.post(`${API_URL}/proteins_for_organisms`, { organisms: organismSelect.value }).then((res) => {
    proteinItems.value = res.data
  }).catch((error) => {
    console.log(error)
  })
}

watch(organismSearch, (val) => {
  val && val !== organismSelect && querySelections(val)
})

function querySelections (v) {
  organismLoading.value = true
  // Simulated ajax query
  setTimeout(() => {
    organismItems.value = organismItems.value.filter(e => {
      return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
    })
    organismLoading.value = false
  }, 500)
}

</script>