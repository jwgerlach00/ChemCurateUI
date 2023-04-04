<template>
  <v-app class="v-app">
    <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'/> <!-- Google font import -->
    <v-main>
      <h1>AutoChem</h1>
      <v-row justify="center" dense>
        <v-col cols="6">
          <v-btn-toggle v-if="route.name !== 'login'" color="green-accent-2" divided style="width:100%;overflow-x:auto;">
            <v-btn class="nav-bar" style="width:50%;">logout</v-btn>
            <v-btn class="nav-bar" style="width:50%;">ape</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <router-view class="router-view"/>
    </v-main>
  </v-app>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
