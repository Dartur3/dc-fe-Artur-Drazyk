<template>
  <div>
    
    {{setFavouritesPage(page)}}
    <button v-if="page > 1" type="button" class="droptxt" v-on:click="setFavouritesPage(page-=20)">-</button>
    <button v-else type="button" class="droptxt">-</button>
    <button v-if="isFavouritesEnd(page+20)" type="button" class="droptxt" v-on:click="setFavouritesPage(page+=20)">+</button>
    <button v-else type="button" class="droptxt">+</button>

    <SearchBar v-on:pass-search-bar-data="passSearchBarData" />

    <div v-if="isFavourites()">

      <p v-if="error">Something went wrong...</p>
      <p v-else-if="loading">Loading...</p>

      <div v-else-if="buttonClicked.name && result && result.charactersByIds" >
        <div v-for="character in result.charactersByIds" :key="character.id">
          <div v-if="character.name.indexOf(id.name) !== -1">
            <img :src="`${character.image}`">
            <p class="inline">{{ character.id }} {{ character.name }}</p>
            <button type="button" class="inline" v-on:click="removeFavourite(character.id)">X</button>
          </div>
        </div>
      </div>

      <div v-else-if="buttonClicked.id && result && result.charactersByIds" >
        <div v-for="character in result.charactersByIds" :key="character.id">
          <div v-if="character.id == id.nameAndEpisodeId">
            <img :src="`${character.image}`">
            <p class="inline">{{ character.id }} {{ character.name }}</p>
            <button type="button" class="inline" v-on:click="removeFavourite(character.id)">X</button>
          </div>
        </div>
      </div>

      <div v-else-if="buttonClicked.episode && result && result.charactersByIds" >
        <div v-for="character in result.charactersByIds" :key="character.id">
          <div v-for="episodeId in character.episode" :key="episodeId.id">
            <div v-if="episodeId.id == id.nameAndEpisodeId">
              <img :src="`${character.image}`">
              <p class="inline">{{ character.id }} {{ character.name }}</p>
              <button type="button" class="inline" v-on:click="removeFavourite(character.id)">X</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">

import gql from 'graphql-tag'
import { defineComponent, reactive } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import SearchBar from '../components/SearchBar.vue';
import { getFavourites, deleteFavourite } from './HomeView.vue';

const FAVOURITES_QUERY = gql`
    query CharactersByIds ($ids: [ID!]!) {
      charactersByIds (ids: $ids) {
        id
        name
        image
        episode {
          id
        }
      }
    }
  `
export default defineComponent({

  name: 'FavouritesView',

  components: {
    SearchBar
  },

  data() {
    return {
      page: 1,
      id: { name: '', nameAndEpisodeId: 1 },
      buttonClicked: { name: true, id: false, episode: false },
    }
  },

  setup() {

    const variables = reactive({
      ids: [0]
    })

    const { result, loading, error } = useQuery(FAVOURITES_QUERY, variables)

    function setFavouritesPage(page: number) {
      variables.ids = getFavourites().filter(function (currentPage) { return currentPage >= page && currentPage <= page+19 })
    }

    return {
      result,
      loading,
      error,
      setFavouritesPage
    }
  },

  methods: {

    isFavourites() {
      if (getFavourites().length > 0) return true
      else return false
    },

    isFavouritesEnd(page: number) {
      if (getFavourites().filter(function (currentPage) { return currentPage >= page && currentPage <= page+1 }).length != 0) return true
      else return false
    },

    removeFavourite(id: number) {
      deleteFavourite(id)
    },

    passSearchBarData({ name, id, episode, input }: any) {
      this.buttonClicked.name = name
      this.buttonClicked.id = id
      this.buttonClicked.episode = episode
      this.id.name = input
      this.id.nameAndEpisodeId = parseInt(input)
    }
  }
})
</script>