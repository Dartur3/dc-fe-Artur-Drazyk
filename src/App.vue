<template>

  <img alt="Vue logo" src="./assets/logo.png">
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
  <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->

  <div>
    <button v-if="page > 1" type="button" v-on:click="setPage(--page)">-</button>
    <button v-else type="button">-</button>
    <button v-if="resultNames && resultNames.characters.info && page < resultNames.characters.info.count/20" type="button" v-on:click="setPage(++page)">+</button>
    <button v-else type="button">+</button>
    <input type="text" placeholder="input text" v-model=input>
    <button type="button" v-on:click="setName(input), input = '' , setPage(page = 1), buttonClicked.name = true, buttonClicked.id = false, buttonClicked.episode = false, buttonClicked.favourites = false">filter by name</button>
    <button type="button" v-on:click="setNameId(parseInt(input)), input = '' , setPage(page = 1), buttonClicked.name = false, buttonClicked.id = true, buttonClicked.episode = false, buttonClicked.favourites = false">filter by id</button>
    <button type="button" v-on:click="setEpisodeId(parseInt(input)), input = '' , setPage(page = 1), buttonClicked.name = false, buttonClicked.id = false, buttonClicked.episode = true, buttonClicked.favourites = false">filter by episode</button>
    <button type="button" v-on:click="input = '' , setPage(page = 1), buttonClicked.name = false, buttonClicked.id = false, buttonClicked.episode = true, buttonClicked.favourites = true">favourites</button>
  </div>

  <div v-if="buttonClicked.name">
      <p class="inline" v-for="favourite in getFavourites()" :key="favourite">{{ favourite }}</p>
      <p v-if="errorNames">Something went wrong...</p>
      <p v-else-if="loadingNames">Loading...</p>
      <div v-else-if="resultNames && resultNames.characters.results" v-for="character in resultNames.characters.results" :key="character.id">
        <img :src="`${ character.image }`">
        <p class="inline">{{ character.id }} {{ character.name }}</p>
        <button class="inline" type="button" v-on:click="addFavourite(character.id)">&#9829;</button>
      </div>
  </div>

  <div v-else-if="buttonClicked.id">
    <p v-if="errorId">Something went wrong...</p>
    <p v-else-if="loadingId">Loading...</p>
    <div v-else-if="resultId && resultId.character">
      <img :src="`${ resultId.character.image }`">
      <p class="inline">{{ resultId.character.id }} {{ resultId.character.name }}</p>
    </div>
  </div>

  <div v-else-if="buttonClicked.episode">
      <p v-if="errorEpisode">Something went wrong...</p>
      <p v-else-if="loadingEpisode">Loading...</p>
      <div v-else-if="resultEpisode && resultEpisode.episode.characters" v-for="character in resultEpisode.episode.characters" :key="character.id">
        <img :src="`${ character.image }`">
        <p class="inline">{{ character.id }} {{ character.name }}</p>
      </div>
  </div>
</template>

<script lang="ts">

import gql from 'graphql-tag'
import { defineComponent, reactive } from 'vue';
import { useQuery } from '@vue/apollo-composable';
// import HelloWorld from './components/HelloWorld.vue';

const NAMES_QUERY = gql`
  query Names ($page: Int!, $name: String!) {
    characters (page: $page, filter: { name: $name}) {
      info {
        count
      }
      results {
        id
        name
        image
      }
    }
  }
`
const ID_QUERY = gql`
  query Id ($nameId: ID!){
	  character(id: $nameId) {
      id
  	  name
      image
	  }
  }
`
const EPISODE_QUERY = gql`
  query Episode ($episodeId: ID!){
	  episode(id: $episodeId) {
      characters {
        id
        name
        image
      }
	  }
  }
  `

export default defineComponent({

  name: 'App',

  components: {
    // HelloWorld
  },

  data() {
    return {
      input: '',
      page: 1,
      buttonClicked: { name: true, id: false, episode: false, favourites: false }
    }
  },

  setup() {
    const variables = reactive({
      nameId: 1,
      episodeId: 1,
      page: 1,
      name: ''
    })

    const favourites = reactive([0])
    favourites.pop()

    const { result: resultNames, loading: loadingNames, error: errorNames } = useQuery(NAMES_QUERY, variables)
    const { result: resultId, loading: loadingId, error: errorId } = useQuery(ID_QUERY, variables)
    const { result: resultEpisode, loading: loadingEpisode, error: errorEpisode } = useQuery(EPISODE_QUERY, variables)

    function setPage(page: number) {
      variables.page = page
    }

    function setName(name: string) {
      variables.name = name
    }

    function setNameId(id: number) {
      if (isNaN(id)) return
      variables.nameId = id
    }

    function setEpisodeId(id: number) {
      if (isNaN(id)) return
      variables.episodeId = id
    }

    function addFavourite(id: number) {
      if (favourites.indexOf(id) !== -1) return
      favourites.push(id)
    }

    function deleteFavourite(id: number) {
      favourites.splice(id, 1)
    }

    function getFavourites() {
      return favourites
    }

    return {
      resultNames: resultNames, resultId: resultId, resultEpisode: resultEpisode,
      loadingNames: loadingNames, loadingId: loadingId, loadingEpisode: loadingEpisode,
      errorNames: errorNames, errorId: errorId, errorEpisode: errorEpisode,
      setPage,
      setName,
      setNameId,
      setEpisodeId,
      addFavourite,
      deleteFavourite,
      getFavourites
    }
  }
});

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
