<template>
  <button v-if="page > 1" type="button" class="droptxt" v-on:click="setPage(--page)">-</button>
  <button v-else type="button" class="droptxt">-</button>
  <button v-if="resultNames && resultNames.characters.info && page < resultNames.characters.info.count / 20"
    type="button" class="droptxt" v-on:click="setPage(++page)">+</button>
  <button v-else type="button" class="droptxt">+</button>

  <SearchBar v-on:pass-search-bar-data="passSearchBarData" v-on:initialize-input="setName(id.name), setNameAndEpisodeId(id.nameAndEpisodeId), setPage(page)" />

  <p v-if="errorNames || errorId || errorEpisode">Something went wrong...</p>
  <p v-else-if="loadingNames || loadingId || loadingEpisode">Loading...</p>

  <div v-if="buttonClicked.name && resultNames && resultNames.characters.results">
    <div v-for="character in resultNames.characters.results" :key="character.id">
      <img :src="`${character.image}`">
      <p class="inline">{{ character.id }} {{ character.name }}</p>
      <button v-if="getFavourites().indexOf(character.id) === -1" class="inline" type="button" v-on:click="addFavourite(character.id)">&#9829;</button>
      <button v-else type="button" class="inline" v-on:click="deleteFavourite(character.id)">X</button>
    </div>
  </div>

  <div v-else-if="buttonClicked.id && resultId && resultId.character">
    <img :src="`${resultId.character.image}`">
    <p class="inline">{{ resultId.character.id }} {{ resultId.character.name }}</p>
    <button v-if="getFavourites().indexOf(resultId.character.id) === -1" class="inline" type="button" v-on:click="addFavourite(resultId.character.id)">&#9829;</button>
    <button v-else type="button" class="inline" v-on:click="deleteFavourite(resultId.character.id)">X</button>
  </div>

  <div v-else-if="buttonClicked.episode && resultEpisode && resultEpisode.episode.characters">
    <div v-for="character in resultEpisode.episode.characters" :key="character.id">
      <img :src="`${character.image}`">
      <p class="inline">{{ character.id }} {{ character.name }}</p>
      <button v-if="getFavourites().indexOf(character.id) === -1" class="inline" type="button" v-on:click="addFavourite(character.id)">&#9829;</button>
      <button v-else type="button" class="inline" v-on:click="deleteFavourite(character.id)">X</button>
    </div>
  </div>
</template>

<script lang="ts">

import gql from 'graphql-tag'
import { defineComponent, reactive } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import SearchBar from '../components/SearchBar.vue';

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
let favourites: number[] = reactive(JSON.parse(localStorage.getItem("storedFavourites")!)) || reactive([])

export function getFavourites() {
  return favourites
}

function saveFavourites() {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem('storedFavourites', JSON.stringify(favourites))
  }
  if (JSON.parse(localStorage.getItem("storedFavourites")!).length == 0){
    localStorage.removeItem("storedFavourites")
  }
}

function addFavourite(id: number) {
  favourites.push(id)
  saveFavourites()

}

export function deleteFavourite(id: number) {
  favourites.splice(favourites.indexOf(id), 1)
  saveFavourites()
}


export default defineComponent({

  name: 'HomeView',

  components: {
    SearchBar
  },

  data() {
    return {
      page: 1,
      input: '',
      id: { name: '', nameAndEpisodeId: 1 },
      buttonClicked: { name: true, id: false, episode: false },
    }
  },

  setup() {

    const variables = reactive({
      nameId: 1,
      episodeId: 1,
      page: 1,
      name: ''
    })

    const { result: resultNames, loading: loadingNames, error: errorNames } = useQuery(NAMES_QUERY, variables)
    const { result: resultId, loading: loadingId, error: errorId } = useQuery(ID_QUERY, variables)
    const { result: resultEpisode, loading: loadingEpisode, error: errorEpisode } = useQuery(EPISODE_QUERY, variables)


    function setPage(page: number) {
      variables.page = page
    }

    function setName(name: string) {
      variables.name = name
    }

    function setNameAndEpisodeId(id: number) {
      if (isNaN(id)) return
      variables.nameId = id
      variables.episodeId = id
    }

    return {
      resultNames: resultNames, resultId: resultId, resultEpisode: resultEpisode,
      loadingNames: loadingNames, loadingId: loadingId, loadingEpisode: loadingEpisode,
      errorNames: errorNames, errorId: errorId, errorEpisode: errorEpisode,
      setPage,
      setName,
      setNameAndEpisodeId,
      addFavourite,
      deleteFavourite,
      getFavourites,
      saveFavourites,
    }
  },

  methods: {
    passSearchBarData({ name, id, episode, input, page }: any) {
      this.buttonClicked.name = name
      this.buttonClicked.id = id
      this.buttonClicked.episode = episode
      this.id.name = input
      this.id.nameAndEpisodeId = parseInt(input)
      this.page = page
    }
  },
});

</script>