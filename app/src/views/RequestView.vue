<template>
  <v-row justify="center" dense>
    <v-col cols="6">
      <v-card>
        <UniprotQueryDB class="uniprot-query"/>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { API_URL } from '@/main.js'
import UniprotQueryDB from '@/components/UniprotQueryDB.vue'

const router = useRouter()

onBeforeMount(() => {
  axios.get(`${API_URL}/is_authenticated`).catch(e => {
    if (e.response.status === 401) {
      router.push({ name: 'login' })
    }
  })
})
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
