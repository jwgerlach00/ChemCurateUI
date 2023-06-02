<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-autocomplete label="Protein Accessions" :items="proteinAccessionsShownOnPage" v-model="proteinAccessionSelect"
          v-model:search="proteinAccessionSearch" variant="outlined" chips multiple hide-details clearable>
          <!-- Pagination -->
          <template v-slot:append-item>
            <v-row justify="center" dense>
              <v-col cols="10">
                <v-pagination v-model="proteinAccessionPage"
                  :length="proteinAccessionNumPages" rounded="circle"/>
              </v-col>
            </v-row>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>

    <v-row style="margin-top:10px;">
      <v-col cols="12">
        <v-btn v-if="showSubmit" @click="submit()" color="green-accent-2" block>Download</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, onBeforeMount, computed } from 'vue'
import { API_URL } from '@/main.js'
import axios from 'axios'

const allProteinAccessions = ref([])
const proteinAccessionSearch = ref('')
const proteinAccessionSelect = ref([])

////////// Pagination //////////
const proteinAccessionPageLength = 10
const proteinAccessionsShownOnPage = ref([])
const proteinAccessionPage = ref(1)
const proteinAccessionNumPages = ref(null)
watch(proteinAccessionPage, (val) => {
  queryProteinAccessionSelections(proteinAccessionSearch.value, val) // Change page
})

onBeforeMount(async () => {
  /*
    Get all possible protein accessions from API
  */
  const out = await axios.get(`${API_URL}/get_all_protein_accessions`) // get a list of all possible protein accessions
  allProteinAccessions.value = out.data
  queryProteinAccessionSelections('', 1) // initial query to just show first page
})

watch(proteinAccessionSearch, (val) => {
  val && val !== proteinAccessionSelect && queryProteinAccessionSelections(val, 1) // Page 1
})

function queryProteinAccessionSelections (val, targetPage) {
  const all = queryFilter(allProteinAccessions.value, val)
  proteinAccessionNumPages.value = Math.ceil(all.length/proteinAccessionPageLength)
  proteinAccessionsShownOnPage.value = all.slice((targetPage-1)*proteinAccessionPageLength, (targetPage-1)*proteinAccessionPageLength + 
    proteinAccessionPageLength)
}

function queryFilter(items, value) {
  return items.filter(function(e) {
    return (e || '').toLowerCase().indexOf((value || '').toLowerCase()) > -1;
  })
}

const errorMsg = ref('')

////////// Submit button //////////
const showSubmit = computed(() => {
  if (proteinAccessionSelect.value.length) {
    return true
  }
})

function submit () {
  console.log('ape', proteinAccessionSelect.value)
  axios.post(`${API_URL}/submit_protein_accession_query`, { protein_accessions: proteinAccessionSelect.value }, { responseType: 'arraybuffer' })
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
}
</script>