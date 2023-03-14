<template>
  <v-container>

    <!-- Organism autocomplete selection -->
    <v-row dense>
      <v-col cols="12">
        <v-autocomplete label="Organisms" :loading="organismLoading" :items="organismItems" v-model="organismSelect"
          v-model:search="organismSearch" color="black" chips multiple hide-details clearable/>
      </v-col>
    </v-row>

    <!-- Protein selections -->
    <div v-if="organismSelect.length">
      <h3 style="margin-top:10px;">Proteins</h3>

      <!-- Autocomplete selection component for each selected organism -->
      <div v-for="organism in organismSelect" :key="organism">
        <v-row dense>
          <v-col cols="12" dense>
            <v-autocomplete :label="`${organism} Proteins`" :loading="proteinLoading[organism]"
              :items="proteinItems[organism]" v-model="proteinSelect[organism]" v-model:search="proteinSearch[organism]"
              color="black" chips multiple hide-details clearable>

              <!-- Pagination -->
              <template v-slot:append-item>
                <v-row justify="center" dense>
                  <v-col cols="10">
                    <v-pagination v-model="pages[organism]"
                      :length="Math.ceil(uniprotMapObject[organism].length/pageLength)" rounded="circle"/>
                  </v-col>
                </v-row>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Submit button -->
    <v-row style="margin-top:10px;">
      <v-col cols="12">
        <v-btn v-if="showSubmit" color="green-accent-2" block>Submit</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from 'axios'
import { ref, watch, computed, onBeforeMount } from 'vue'
import { API_URL } from '@/main.js'

/* ----------------------------------------------- API initialization ----------------------------------------------- */
let uniprotMapObject = {}
const organismItems = ref([])
onBeforeMount(async () => {
  /*
    SHOULD ADD LOADING HERE
  */
  const out = await axios.get(`${API_URL}/get_uniprot_map`)
  uniprotMapObject = out.data
  organismItems.value = Object.keys(out.data) // Display names (formatted by API)
})

/* ------------------------------------------------------ VARS ------------------------------------------------------ */
// Additional organism vars
const organismLoading = ref(false)
const organismSearch = ref('')
const organismSelect = ref([])

// Protein vars
const proteinLoading = ref({})
const proteinItems = ref({})
const proteinSearch = ref({})
const proteinSelect = ref({})

/* ----------------------------------------------- Protein pagination ----------------------------------------------- */
const pageLength = 10
const pages = ref({})

watch(pages, (val) => {
  for (let organism of organismSelect.value) {
    changePage(val[organism], organism)
  }
}, { deep: true })

function changePage(targetPage, organism) {
  proteinItems.value[organism] = queryFilter(uniprotMapObject[organism], proteinSearch.value[organism])
    .slice((targetPage-1)*pageLength, (targetPage-1)*pageLength + pageLength)
}

/* -------------------------------------------------- Submit button ------------------------------------------------- */
const showSubmit = computed(() => {
  if (Object.keys(proteinSelect.value).length) {
    for (let protein in proteinSelect.value) {
      if (protein.length) {
        return true
      }
    }
  }
})

/* ----------------------------------------------- Autocomplete query ----------------------------------------------- */
function queryFilter(items, value) {
  return items.filter(function(e) {
    return (e || '').toLowerCase().indexOf((value || '').toLowerCase()) > -1;
  })
}

watch(organismSelect, (val) => {
  for (let organism of val) {
    proteinSearch.value[organism] = ''
    changePage(1, organism)
    proteinLoading.value[organism] = false
    pages.value[organism] = 1
  }
})

function queryOrganismSelections (val) {
  organismLoading.value = true
  organismItems.value = queryFilter(Object.keys(uniprotMapObject), val) 
  organismLoading.value = false
}

function queryProteinSelections (val, organism) {
  proteinLoading.value[organism] = true
  proteinItems.value[organism] = queryFilter(uniprotMapObject[organism], val).slice(0, pageLength)
  proteinLoading.value[organism] = false
}

watch(organismSearch, (val) => {
  console.log('organism', val)
  val && val !== organismSelect && queryOrganismSelections(val)
})

watch(proteinSearch, (val) => {
  for (let organism of organismSelect.value) {
    val[organism] && val[organism] !== proteinSelect.value[organism] && queryProteinSelections(val[organism], organism)
  }
}, { deep: true })
</script>

<style scoped>
button.v-btn {
  height: 60px;
}
</style>
