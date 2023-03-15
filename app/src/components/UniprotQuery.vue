<template>
  <v-container>

    <!-- Database selection -->
    <v-row dense>
      <v-col>
        <v-select label="Database sources" :items="DBOptions" v-model="DBSelect" variant="outlined" chips multiple
          hide-details clearable></v-select>
      </v-col>
    </v-row>

    <!-- Organism autocomplete selection -->
    <v-row v-if="DBSelect.length">
      <v-col cols="12">
        <v-autocomplete label="Organisms" :items="organismItems" v-model="organismSelect"
          v-model:search="organismSearch" variant="outlined" chips multiple hide-details clearable/>
      </v-col>
    </v-row>

    <!-- Protein selections -->
    <div v-if="organismSelect.length">
      <h3 style="margin-top:10px;">Proteins</h3>

      <!-- Autocomplete selection component for each selected organism -->
      <div v-for="organism in organismSelect" :key="organism">
        <v-row>
          <v-col cols="12" dense>
            <v-autocomplete :label="`${organism} Proteins`" :items="proteinItems[organism]"
              v-model="proteinSelect[organism]" v-model:search="proteinSearch[organism]" variant="outlined" chips
              multiple hide-details clearable>

              <!-- Pagination -->
              <template v-slot:append-item>
                <v-row justify="center" dense>
                  <v-col cols="10">
                    <v-pagination v-model="pages[organism]"
                      :length="numPages[organism]" rounded="circle"/>
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
        <v-btn v-if="showSubmit" @click="submit()" color="green-accent-2" block>Submit</v-btn>
      </v-col>
    </v-row>

    <v-row dense style="margin-top:0px;">
      <v-col>
        <v-alert v-if="errorMsg" type="error" color="red-accent-2">{{ errorMsg }}</v-alert>
        <v-alert v-if="successMsg" type="success" color="green-accent-2">{{ successMsg }}</v-alert>
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
// Database vars
const DBOptions = [
  'PubChem',
  'ChEMBL'
].sort()
const DBSelect = ref([])

// Additional organism vars
const organismSearch = ref('')
const organismSelect = ref([])

// Protein vars
const proteinItems = ref({})
const proteinSearch = ref({})
const proteinSelect = ref({})

function clearProteinVars (organisms) {
  /*
    Delete key-value pairs for newly deselected organisms
  */
  for (let key of Object.keys(proteinItems.value)) {
    if (!organisms.includes(key)) {
      delete proteinItems.value[key]
      delete proteinSearch.value[key]
      delete proteinSelect.value[key]
      // Delete pagination vars too because they are dependent on protein keys
      delete pages.value[key]
      delete numPages.value[key]
    }
  }
}

function initProteinVars (organisms) {
  /*
    Set keys for newly selected organisms
  */
  for (let organism of organisms) {
    if (!proteinItems.value[organism]) {
      proteinItems.value[organism] = []
      proteinSearch.value[organism] = ''
      proteinSelect.value[organism] = []
      pages.value[organism] = 1
      numPages.value[organism] = null
    }
  }
}

/* ----------------------------------------------- Protein pagination ----------------------------------------------- */
const pageLength = 10
const pages = ref({})
const numPages = ref({})

watch(pages, (val) => {
  for (let organism of organismSelect.value) {
    queryProteinSelections(proteinSearch.value[organism], organism, val[organism]) // Change page
  }
}, { deep: true })

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

function submit () {
  errorMsg.value = ''
  successMsg.value = ''

  for (let val of Object.values(proteinSelect.value)) {
    if (!val.length) {
      errorMsg.value = 'Select at least one protein for each organism or removed unused organisms.'
      return
    }
  }

  const data = {
    databases: DBSelect.value,
    organism_protein_map: proteinSelect.value
  }

  axios.post(`${API_URL}/submit`, data)
    .then((res) => {
      if (res.data.error) {
        errorMsg.value = res.data.error
      } else {
        successMsg.value = 'Success! Your job has been submitted.'
      }
    })
    .catch((_) => {
      errorMsg.value = 'Error! Please try again.'
    })
}

/* ------------------------------------------------- Error flagging ------------------------------------------------- */
const errorMsg = ref('')
const successMsg = ref('')

/* ----------------------------------------------- Autocomplete query ----------------------------------------------- */
function queryFilter(items, value) {
  return items.filter(function(e) {
    return (e || '').toLowerCase().indexOf((value || '').toLowerCase()) > -1;
  })
}

watch(organismSelect, (val) => {
  queryOrganismSelections('') // Clear organism search
  clearProteinVars(val) // Remove protein entries if organisms were deselected
  initProteinVars(val) // Initialize protein vars for new organisms
})

function queryOrganismSelections (val) {
  organismItems.value = queryFilter(Object.keys(uniprotMapObject), val) 
}

function queryProteinSelections (val, organism, targetPage) {
  const all = queryFilter(uniprotMapObject[organism], val)
  numPages.value[organism] = Math.ceil(all.length/pageLength)
  proteinItems.value[organism] = all.slice((targetPage-1)*pageLength, (targetPage-1)*pageLength + pageLength)
}

watch(organismSearch, (val) => {
  val && val !== organismSelect && queryOrganismSelections(val)
})

watch(proteinSearch, (val) => {
  for (let organism of organismSelect.value) {
    val[organism] && val[organism] !== proteinSelect.value[organism] &&
      queryProteinSelections(val[organism], organism, 1) // Page 1
  }
}, { deep: true })
</script>

<style scoped>
button.v-btn {
  height: 60px;
}
</style>
