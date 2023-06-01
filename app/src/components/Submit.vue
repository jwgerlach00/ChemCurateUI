<template>
  <!-- Submit button -->
  <v-row style="margin-top:10px;">
    <v-col cols="12">
      <v-btn v-if="showSubmit" @click="submit()" color="green-accent-2" block>Submit</v-btn>
    </v-col>
  </v-row>

  <!-- <v-row dense style="margin-top:0px;">
    <v-col>
      <v-alert v-if="errorMsg" type="error" color="red-accent-2">{{ errorMsg }}</v-alert>
      <v-alert v-if="successMsg" type="success" color="green-accent-2">{{ successMsg }}</v-alert>
    </v-col>
  </v-row> -->
  <div>

  </div>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue'

const props = defineProps({
  organismProteinMap: {
    type: Object,
    required: true
  }
})

////////// Error flagging //////////
const errorMsg = ref('')
const successMsg = ref('')

////////// Submit button //////////
const showSubmit = computed(() => {
  if (Object.keys(props.organismProteinMap).length) {
    for (let protein in props.organismProteinMap) {
      if (protein.length) {
        return true
      }
    }
  }
})

function submit () {
  errorMsg.value = ''
  successMsg.value = ''

  for (let val of Object.values(organismProteinMap.value)) {
    if (!val.length) {
      errorMsg.value = 'Select at least one protein for each organism or de-select unused organisms.'
      return
    }
  }

  axios.post(`${API_URL}/submit`, { organism_protein_map: organismProteinMap.value })
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
</script>

<style scoped>
button.v-btn {
  height: 60px;
}
</style>
