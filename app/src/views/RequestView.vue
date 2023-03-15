<template>
  <v-container>
    <v-card>
      <v-row>
        <v-col cols="12">
          <UniprotQuery/>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { API_URL } from '@/main.js'
import UniprotQuery from '@/components/UniprotQuery.vue'

const router = useRouter()

// onBeforeMount(() => {
//   axios.get(`${API_URL}/is_authenticated`).catch(e => {
//     if (e.response.status === 401) {
//       router.push({ name: 'login' })
//     }
//   })
// })
</script>

<style scoped>
div.v-card {
  margin: auto;
  min-height: 20vh;
  max-height: 70vh;
  overflow-y: auto;
  overflow-x:auto;
  max-width: 800px;
}
.v-col {
  padding: 40px;
}
</style>
