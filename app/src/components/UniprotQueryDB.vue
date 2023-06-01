<template>
  <v-container>

    <!-- Organism autocomplete selection -->
    <v-row>
      <v-col cols="12">
        <v-autocomplete label="Organisms" :items="organismsShownOnPage" v-model="organismSelect"
          v-model:search="organismSearch" variant="outlined" chips multiple hide-details clearable>
          <!-- Pagination -->
          <template v-slot:append-item>
            <v-row justify="center" dense>
              <v-col cols="10">
                <v-pagination v-model="organismPage"
                  :length="organismNumPages" rounded="circle"/>
              </v-col>
            </v-row>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>

    <!-- Protein selections -->
    <div v-if="organismSelect.length">
      <h3 style="margin-top:10px;">Proteins</h3>

      <!-- Autocomplete selection component for each selected organism -->
      <div v-for="organism in organismSelect" :key="organism">
        <v-row>
          <v-col cols="12" dense>
            <v-autocomplete :label="`${organism} Proteins`" :items="proteinsShownOnPage[organism]"
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
    <Submit :organismProteinMap="proteinSelect"/>
  </v-container>
</template>

<script setup>
import axios from 'axios'
import { ref, watch, computed, onBeforeMount } from 'vue'
import { API_URL } from '@/main.js'

import Submit from '@/components/Submit.vue'

/* ----------------------------------------------- API initialization ----------------------------------------------- */
const organismPageLength = 10

const allOrganismsMap = ref({})
const organismsShownOnPage = ref([])
const organismSearch = ref('')
const organismSelect = ref([])
const organismPage = ref(1)
const organismNumPages = ref(null)

onBeforeMount(async () => {
  /*
    SHOULD ADD LOADING ANIMATION HERE
  */
  // const proteinSelect = ref({'a': ['b']})
  const out = await axios.get(`${API_URL}/get_organism_names`)
  allOrganismsMap.value = out.data
  queryOrganismSelections('', organismPage.value) // initial query
})


/* ------------------------------------------------------ VARS ------------------------------------------------------ */
// Protein vars
const proteinsMap = ref({})
const proteinsShownOnPage = ref({})
const proteinSearch = ref({})
const proteinSelect = ref({})

function clearProteinVars (organisms) {
  /*
    Delete key-value pairs for newly deselected organisms
  */
  for (let key of Object.keys(proteinsShownOnPage.value)) {
    if (!organisms.includes(key)) {
      delete proteinsShownOnPage.value[key]
      delete proteinSearch.value[key]
      delete proteinSelect.value[key]
      // Delete pagination vars too because they are dependent on protein keys
      delete pages.value[key]
      delete numPages.value[key]
    }
  }
}

// function initProteinVars (organisms) {
//   /*
//     Set keys for newly selected organisms
//   */
//   for (let organism of organisms) {
//     if (!proteinsShownOnPage.value[organism]) {
//       proteinsShownOnPage.value[organism] = []
//       proteinSearch.value[organism] = ''
//       proteinSelect.value[organism] = []
//       pages.value[organism] = 1
//       numPages.value[organism] = null
//     }
//   }
// }

/* ----------------------------------------------- Organism pagination ---------------------------------------------- */
watch(organismPage, (val) => {
  queryOrganismSelections(organismSearch.value, val) // Change page
})

/* ----------------------------------------------- Protein pagination ----------------------------------------------- */
const proteinPageLength = 10
const pages = ref({})
const numPages = ref({})

watch(pages, (val) => {
  for (let organism of organismSelect.value) {
    queryProteinSelections(proteinSearch.value[organism], organism, val[organism]) // Change page
  }
}, { deep: true })

/* ----------------------------------------------- Autocomplete query ----------------------------------------------- */
function queryOrganismSelections (val, targetPage) {
  organismNumPages.value = Math.ceil(Object.keys(allOrganismsMap.value).length/organismPageLength)
  organismsShownOnPage.value = Object.keys(allOrganismsMap.value).slice((targetPage-1)*organismPageLength, (targetPage-1)*organismPageLength + 
    organismPageLength)
}

function queryFilter(items, value) {
  return items.filter(function(e) {
    return (e || '').toLowerCase().indexOf((value || '').toLowerCase()) > -1;
  })
}

watch(organismSelect, (val) => {
  const subset = organismSelect.value.reduce((acc, key) => {
    if (key in allOrganismsMap.value) {
      acc[key] = allOrganismsMap.value[key];
    }
    return acc;
  }, {});

  axios.post(`${API_URL}/post_protein_names`, { organism_map: subset })
    .then((res) => {
      if (res.data.error) {
        errorMsg.value = res.data.error
      } else {
        // console.log(Object.keys(res.data))
        for (const organism of Object.keys(res.data)) {
          console.log(organism)
          proteinsMap.value[organism] = Object.keys(res.data[organism])
          queryProteinSelections('', organism, 1)
        }
      }
    })
  
  clearProteinVars(val) // Remove protein entries if organisms were deselected
  // initProteinVars(val) // Initialize protein vars for new organisms
})

function queryProteinSelections (val, organism, targetPage) {
  // console.log(uniprotMapObject[organism])
  console.log(proteinsMap.value[organism])
  const all = queryFilter(proteinsMap.value[organism], val)
  // console.log
  numPages.value[organism] = Math.ceil(all.length/proteinPageLength)
  proteinsShownOnPage.value[organism] = all.slice((targetPage-1)*proteinPageLength, (targetPage-1)*proteinPageLength + proteinPageLength)
}

watch(organismSearch, (val) => {
  val && val !== organismSelect && queryOrganismSelections(val, 1) // Page 1
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
