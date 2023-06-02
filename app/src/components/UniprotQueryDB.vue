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
            <v-autocomplete :label="`${organism} Proteins`" :items="organismProteinsShownOnPage[organism]"
              v-model="organismProteinSelect[organism]" v-model:search="organismProteinSearch[organism]" variant="outlined" chips
              multiple hide-details clearable>

              <!-- Pagination -->
              <template v-slot:append-item>
                <v-row justify="center" dense>
                  <v-col cols="10">
                    <v-pagination v-model="organismProteinPages[organism]"
                      :length="organismProteinNumPages[organism]" rounded="circle"/>
                  </v-col>
                </v-row>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Submit button -->
    <!-- <Submit :proteinSelect="proteinSelect"/> -->
    <v-row style="margin-top:10px;">
      <v-col cols="12">
        <v-btn v-if="showSubmit" @click="submit()" color="green-accent-2" block>Download</v-btn>
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


/* ----------------------------------------------- VARS ----------------------------------------------- */
////////// Organism storage vars //////////
const allOrganismsMap = ref({}) // all possible organisms map. key: formatted organism name, value: organism scientific name recognized by API
const organismSearch = ref('') // search string for organism autocomplete
const organismSelect = ref([]) // list of select organism formatted names

////////// Organism pagination //////////
const organismPageLength = 10
const organismsShownOnPage = ref([]) // list of formatted organism names to show on page for pagination
const organismPage = ref(1) // current page of organism pagination
const organismNumPages = ref(null) // number of total pages for organism pagination
watch(organismPage, (val) => {
  queryOrganismSelections(organismSearch.value, val) // Change page
})

// Protein vars
const organismProteinMap = ref({}) // key: organism formatted name, value: dict (key: protein formatted name, value: uniprot ID)
const organismProteinSearch = ref({}) // key: organism formatted name, value: search string for protein autocomplete
const organismProteinSelect = ref({}) // key: organism formatted name, value: list of select protein formatted names

////////// Protein pagination //////////
const proteinPageLength = 10 // number of proteins to show on each page
const organismProteinsShownOnPage = ref({}) // key: organism formatted name, value: list of formatted protein names to show on page for pagination
const organismProteinPages = ref({}) // key: organism formatted name, value: current page of protein pagination
const organismProteinNumPages = ref({}) // key: organism formatted name, value: number of total pages for protein pagination
watch(organismProteinPages, (val) => {
  for (let organism of organismSelect.value) {
    queryProteinSelections(organismProteinSearch.value[organism], organism, val[organism]) // Change page
  }
}, { deep: true })






onBeforeMount(async () => {
  /*
    Get all possible organisms from API
  */
  const out = await axios.get(`${API_URL}/get_organism_names`) // get a list of all possible organisms
  allOrganismsMap.value = out.data
  queryOrganismSelections('', organismPage.value) // initial query to just show first page
})


function clearProteinVarsForDeselectedOrganisms (organisms) {
  /*
    Delete key-value pairs for newly deselected organisms
  */
  for (let key of Object.keys(organismProteinMap.value)) {
    if (!organisms.includes(key)) {
      delete organismProteinMap.value[key]
      delete organismProteinSearch.value[key]
      delete organismProteinSelect.value[key]
      delete organismProteinPages.value[key]
      delete organismProteinNumPages.value[key]
    }
  }
}

function initProteinVarsForOrganism (organism, proteins) {
  /*
    Set keys for newly selected organisms
  */
  if (!organismProteinMap.value[organism]) {
    organismProteinMap.value[organism] = proteins
    organismProteinSearch.value[organism] = ''
    organismProteinSelect.value[organism] = []
    organismProteinPages.value[organism] = 1
    organismProteinNumPages.value[organism] = null
  }
}

/* ----------------------------------------------- Organism pagination ---------------------------------------------- */


/* ----------------------------------------------- Protein pagination ----------------------------------------------- */

/* ----------------------------------------------- Autocomplete query ----------------------------------------------- */
function queryOrganismSelections (val, targetPage) {
  const all = queryFilter(Object.keys(allOrganismsMap.value), val)
  console.log(all)
  organismNumPages.value = Math.ceil(all.length/organismPageLength)
  organismsShownOnPage.value = all.slice((targetPage-1)*organismPageLength, (targetPage-1)*organismPageLength + 
    organismPageLength)
}

function queryFilter(items, value) {
  return items.filter(function(e) {
    return (e || '').toLowerCase().indexOf((value || '').toLowerCase()) > -1;
  })
}

watch(organismSelect, (val) => {
  ////////// Convert formatted name into a map w/ key: formatted name, value: scientific name; to pass to API //////////
  const subsetOrganismMap = organismSelect.value.reduce((acc, key) => {
    if (key in allOrganismsMap.value) {
      acc[key] = allOrganismsMap.value[key]
    }
    return acc
  }, {})

  axios.post(`${API_URL}/post_protein_names`, { organism_map: subsetOrganismMap })
    .then((res) => {
      if (res.data.error) {
        errorMsg.value = res.data.error
      } else {
        clearProteinVarsForDeselectedOrganisms(Object.keys(res.data))
        for (const organism of Object.keys(res.data)) {
          initProteinVarsForOrganism([organism], res.data[organism])

        }
      }
    })
})

function queryProteinSelections (val, organism, targetPage) {
  const all = queryFilter(Object.keys(organismProteinMap.value[organism]), val)
  organismProteinNumPages.value[organism] = Math.ceil(all.length/proteinPageLength)
  organismProteinsShownOnPage.value[organism] = all.slice((targetPage-1)*proteinPageLength, (targetPage-1)*proteinPageLength + proteinPageLength)
}

watch(organismSearch, (val) => {
  val && val !== organismSelect && queryOrganismSelections(val, 1) // Page 1
})

watch(organismProteinSearch, (val) => {
  for (const organism of organismSelect.value) {
    val[organism] && val[organism] !== organismProteinSelect.value[organism] && queryProteinSelections(val[organism], organism, 1) // Page 1
  }
}, { deep: true })

////////// Error flagging //////////
const errorMsg = ref('')
const successMsg = ref('')

////////// Submit button //////////
const showSubmit = computed(() => {
  if (Object.keys(organismProteinSelect.value).length) {
    for (let protein in organismProteinSelect.value) {
      if (protein.length) {
        return true
      }
    }
  }
})

function submit () {
  errorMsg.value = ''
  successMsg.value = ''

  for (let val of Object.values(organismProteinSelect.value)) {
    if (!val.length) {
      errorMsg.value = 'Select at least one protein for each organism or de-select unused organisms.'
      return
    }
  }

  const uniprotIds = getUniprotIdsFromFormattedOrganismProteinSelect(organismProteinSelect.value)

  axios.post(`${API_URL}/submit_uniprot_query`, { uniprot_ids: uniprotIds }, { responseType: 'arraybuffer' })
    .then((res) => {
      if (res.data.error) {
        errorMsg.value = res.data.error
      } else {
        // successMsg.value = 'Success! Your job has been submitted.'
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.download = `autochem_out.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

      }
    })
    .catch((_) => {
      errorMsg.value = 'Error! Please try again.'
    })
}

function getUniprotIdsFromFormattedOrganismProteinSelect (map) {
  const uniprotIds = []
  for (const [formattedOrganism, formattedProteins] of Object.entries(map)) {
    for (const formattedProtein of formattedProteins) {
      uniprotIds.push(organismProteinMap.value[formattedOrganism][formattedProtein])
    }
  }
  return uniprotIds
}
</script>

<style scoped>
button.v-btn {
  height: 60px;
}
</style>
