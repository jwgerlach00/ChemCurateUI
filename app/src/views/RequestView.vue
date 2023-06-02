<template>
  <div>
    <v-row justify="center" dense>
      <v-col cols="6">
        <v-btn-toggle v-model="navBar" color="green-accent-2" divided style="width:100%;overflow-x:auto;">
          <v-btn class="nav-bar" value="uniprot" style="width:50%;">UniProt</v-btn>
          <v-btn class="nav-bar" value="proteinAccession" style="width:50%;">Protein Accession</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-row justify="center" dense>
      <v-col cols="6">
        <v-card>
          <UniprotQueryDB class="uniprot-query" v-if="navBar == 'uniprot'"/>
          <ProteinAccessionQueryDB v-else-if="navBar == 'proteinAccession'"/>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { API_URL } from '@/main.js'
import UniprotQueryDB from '@/components/UniprotQueryDB.vue'
import ProteinAccessionQueryDB from '@/components/ProteinAccessionQueryDB.vue'

const router = useRouter()

onBeforeMount(() => {
  axios.get(`${API_URL}/is_authenticated`).catch(e => {
    if (e.response.status === 401) {
      router.push({ name: 'login' })
    }
  })
})

const navBar = ref('uniprot')
</script>

<style scoped>
div.v-card {
  margin: auto;
  min-height: 20vh;
  max-height: 70vh;
  overflow-y: auto;
  overflow-x:auto;
}
.uniprot-query {
  padding: 40px;
}
</style>
