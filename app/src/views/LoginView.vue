<template>
  <v-container>
    <v-card width="500px" height="600px">
      <v-row>
        <v-col>
          <h2>Welcome</h2>
          <br>
          <v-row>
            <v-col>
              <v-btn-toggle color="green-accent-2" style="width:100%;" v-model="modelLoginNav">
                <v-btn class="nav-btn" style="width:50%;" value="login">Login</v-btn>
                <v-btn class="nav-btn" style="width:50%;" value="register">Register</v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
          <v-row justify="center" dense>
            <v-col cols="12">
              <v-text-field label="Username" v-model="username" color="green-accent-2" variant="outlined" hide-details/>
            </v-col>
          </v-row>

          <br v-if="modelLoginNav === 'register'">

          <v-row justify="center" dense>
            <v-col cols="12">
              <v-text-field label="Password" v-model="password" color="green-accent-2" variant="outlined" hide-details
              :append-icon="eyePassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="() => (eyePassword = !eyePassword)"
              :type="eyePassword ? 'password' : 'text'"/>
            </v-col>
          </v-row>

          <v-row justify="center" dense v-if="modelLoginNav === 'register'">
            <v-col cols="12">
              <v-text-field label="Confirm password" v-model="confirmPassword" color="green-accent-2" variant="outlined"
              hide-details
              :append-icon="eyeConfirm ? 'mdi-eye' : 'mdi-eye-off'" @click:append="() => (eyeConfirm = !eyeConfirm)"
              :type="eyeConfirm ? 'password' : 'text'"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn v-if="modelLoginNav === 'login'" @click="login()" color="green-accent-2"
                block>Login</v-btn>
              <v-btn v-else @click="register()" color="green-accent-2" block>Register</v-btn>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-alert type="error" v-if="errorMsg" color="red-accent-2">{{ errorMsg }}</v-alert>
              <v-alert type="success" v-if="successMsg" color="green-accent-2">{{ successMsg }}</v-alert>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import axios from 'axios'
import { API_URL } from '@/main.js'
import { useRouter } from 'vue-router'

const router = useRouter()

onBeforeMount(() => {
  axios.get(`${API_URL}/logout`)
})

const modelLoginNav = ref('login')

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const eyePassword = ref(true)
const eyeConfirm = ref(true)

const errorMsg = ref('')
const successMsg = ref('')

function login () {
  errorMsg.value = ''
  successMsg.value = ''

  axios.post(`${API_URL}/login`, {
    username: username.value,
    password: password.value
  }).then(res => {
    router.push({ name: 'request' })
  }).catch(e => {
    if (e.response.status === 401) {
      errorMsg.value = 'Invalid username or password'
    } else {
      errorMsg.value = 'An errorMsg occurred'
    }
  })
}

function register () {
  errorMsg.value = ''
  successMsg.value = ''

  if (username.value === '' || username.value === '') {
    errorMsg.value = 'Username cannot be empty'
  } else if (password.value === '' || confirmPassword.value === '') {
    errorMsg.value = 'Password cannot be empty'
  } else if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match'
  } else {
    axios.post(`${API_URL}/register`, {
      username: username.value,
      password: password.value
    }).then(_ => {
      successMsg.value = 'User created successfully'
    }).catch(e => {
      if (e.response.status === 409) {
        errorMsg.value = 'Username already exists'
      } else {
        errorMsg.value = 'An error occurred'
      }
    })
  }
}

</script>

<style scoped>
div.v-card {
  margin: auto;
  padding: 20px;
  border-radius: 20px;
}
h2 {
  text-align: center;
  font-size: 30pt;
}
button.v-btn {
  height: 50px;
}
</style>
