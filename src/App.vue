<template>

  <img alt="Vue logo" src="./assets/logo.png">

  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/favourites">Favourites</router-link>
  </nav>

  <router-view/>
  
</template>

<script lang="ts">

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.inline {
  display: inline-block;
  margin-left: 24px;
}
</style>