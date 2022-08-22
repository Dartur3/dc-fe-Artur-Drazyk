<template>

  <button v-if="page > 1" type="button" class="droptxt" v-on:click="setPage(--page)">-</button>
  <button v-else type="button" class="droptxt">-</button>
  <button v-if="resultNames && resultNames.characters.info && page < resultNames.characters.info.count / 20"
    type="button" class="droptxt" v-on:click="setPage(++page)">+</button>
  <button v-else type="button" class="droptxt">+</button>

  <SearchBar v-on:pass-search-bar-data="passSearchBarData"
    v-on:initialize-input="setName(id.name), setId(id.nameId), setEpisodeId(id.episode), setPage(page)" />
  <p class="inline" v-for="favourite in getFavourites()" :key="favourite">{{ favourite }}</p>

  <div v-if="buttonClicked.name">
    <p v-if="errorNames">Something went wrong...</p>
    <p v-else-if="loadingNames">Loading...</p>
    <div v-else-if="resultNames && resultNames.characters.results" v-for="character in resultNames.characters.results" :key="character.id">
      <img :src="`${character.image}`">
      <p class="inline">{{ character.id }} {{ character.name }}</p>
      <button v-if="getFavourites().indexOf(character.id) === -1" class="inline" type="button" v-on:click="addFavourite(character.id)">&#9829;</button>
      <button v-else type="button" class="inline" v-on:click="deleteFavourite(character.id)">X</button>
    </div>
  </div>

  <div v-else-if="buttonClicked.id">
    <p v-if="errorId">Something went wrong...</p>
    <p v-else-if="loadingId">Loading...</p>
    <div v-else-if="resultId && resultId.character">
      <img :src="`${resultId.character.image}`">
      <p class="inline">{{ resultId.character.id }} {{ resultId.character.name }}</p>
      <button v-if="getFavourites().indexOf(resultId.character.id) === -1" class="inline" type="button" v-on:click="addFavourite(resultId.character.id)">&#9829;</button>
      <button v-else type="button" class="inline" v-on:click="deleteFavourite(resultId.character.id)">X</button>
    </div>
  </div>

  <div v-else-if="buttonClicked.episode">
    <p v-if="errorEpisode">Something went wrong...</p>
    <p v-else-if="loadingEpisode">Loading...</p>
    <div v-else-if="resultEpisode && resultEpisode.episode.characters"
      v-for="character in resultEpisode.episode.characters" :key="character.id">
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
    query Id ($id: ID!){
      character(id: $id) {
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
const favourites = reactive([0])
favourites.pop()

export function getFavourites() {
  return favourites
}

function addFavourite(id: number) {
  favourites.push(id)
}

export function deleteFavourite(id: number) {
  favourites.splice(favourites.indexOf(id), 1)
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
      id: { name: '', nameId: 1, episode: 1 },
      buttonClicked: { name: true, id: false, episode: false },
    }
  },

  setup() {

    const variables = reactive({
      id: 1,
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

    function setId(id: number) {
      if (isNaN(id)) return
      variables.id = id
    }

    function setEpisodeId(id: number) {
      if (isNaN(id)) return
      variables.episodeId = id
    }

    return {
      resultNames: resultNames, resultId: resultId, resultEpisode: resultEpisode,
      loadingNames: loadingNames, loadingId: loadingId, loadingEpisode: loadingEpisode,
      errorNames: errorNames, errorId: errorId, errorEpisode: errorEpisode,
      setPage,
      setName,
      setId: setId,
      setEpisodeId,
      addFavourite,
      deleteFavourite,
      getFavourites
    }
  },

  methods: {
    passSearchBarData({ name, id, episode, input, page }: any) {
      this.buttonClicked.name = name
      this.buttonClicked.id = id
      this.buttonClicked.episode = episode
      this.id.name = input
      this.id.nameId = parseInt(input)
      this.id.episode = parseInt(input)
      this.page = page
    }
  }
});

</script>