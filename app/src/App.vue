<template>
  <v-app class="v-app">
    <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'/> <!-- Google font import -->
    <v-main>
      <h1>AutoChem</h1>
      <!-- <v-row justify="center" dense>
        <v-col cols="6">
          <v-btn-toggle v-if="route.name !== 'login'" v-model="navBar" color="green-accent-2" divided
            style="width:100%;overflow-x:auto;">
            <v-btn class="nav-bar" value="uniprot" style="width:50%;">UniProt</v-btn>
            <v-btn class="nav-bar" value="proteinAccession" style="width:50%;">Protein Accession</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row> -->
      <router-view class="router-view"/>
    </v-main>
  </v-app>
</template>

<script setup>
// import { ref } from 'vue'
// import { useRoute } from 'vue-router'

// const route = useRoute()

// const navBar = ref('uniprot')
</script>
