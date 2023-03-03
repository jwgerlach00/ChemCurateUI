<template>
  <v-autocomplete label="Targets" :loading="loading" :items="items" v-model="select" v-model:search="search" chips multiple hide-details color="black"/>
</template>

<script setup>
import { ref, watch } from 'vue'

const loading = ref(false)
const items = ref([])
const search = ref(null)
const select = ref(null)
const states = [
  'Alabama',
  'Alaska',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District of Columbia',
  'Federated States of Micronesia',
  'Florida',
  'Georgia',
  'Guam',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Marshall Islands',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Northern Mariana Islands',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Palau',
  'Pennsylvania',
  'Puerto Rico',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virgin Island',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
]

watch(search, (val) => {
  val && val !== select && querySelections(val)
})

function querySelections (v) {
  loading.value = true
  // Simulated ajax query
  setTimeout(() => {
    items.value = states.filter(e => {
      return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
    })
    loading.value = false
  }, 500)
}

</script>