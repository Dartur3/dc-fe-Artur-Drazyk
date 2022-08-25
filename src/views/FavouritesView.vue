<template>
  <router-link class="dropbtn rounded" style="margin-right: 20px;" to="/">Home</router-link>
  <SearchBar v-on:pass-search-bar-data="passSearchBarData" style="display: inline-block;"/>
  <div v-if="isFavourites()">

    <div v-once>{{ setFavourites() }}</div>
    <p v-if="error">Something went wrong...</p>
    <p v-else-if="loading">Loading...</p>

    <table>
      <tr>
        <th>Photo</th>
        <th>Character ID</th>
        <th>Name</th>
        <th>Gender</th>
        <th>Species</th>
        <th>Last Episode</th>
        <th>Favourites</th>
      </tr>

      <template v-if="buttonClicked.name && result && result.charactersByIds" >
        <tr v-for="character in result.charactersByIds" :key="character.id">
          <td v-if="character.status == 'Alive'"><img :src="`${character.image}`"></td>
          <td v-else-if="character.status == 'Dead'"><img class="dead" :src="`${character.image}`"></td>
          <td v-else-if="character.status == 'unknown'"><img class="unknown" :src="`${character.image}`"></td>
          <td>{{ character.id }}</td>
          <td>{{ character.name }}</td>
          <td>{{ character.gender }}</td>
          <td>{{ character.species }}</td>
          <td>{{ character.episode[character.episode.length-1].episode }}</td>
          <td><button type="button" class="dropdelbtn rounded" v-on:click="removeFavourite(character.id)">X</button></td>
        </tr>
      </template>

      <template v-else-if="buttonClicked.id && result && result.charactersByIds" >
        <tr v-for="character in result.charactersByIds" :key="character.id">
          <template v-if="character.id == id.nameAndEpisodeId">
            <td v-if="character.status == 'Alive'"><img :src="`${character.image}`"></td>
            <td v-else-if="character.status == 'Dead'"><img class="dead" :src="`${character.image}`"></td>
            <td v-else-if="character.status == 'unknown'"><img class="unknown" :src="`${character.image}`"></td>
            <td>{{ character.id }}</td>
            <td>{{ character.name }}</td>
            <td>{{ character.gender }}</td>
            <td>{{ character.species }}</td>
            <td>{{ character.episode[character.episode.length-1].episode }}</td>
            <td><button type="button" class="dropdelbtn rounded" v-on:click="removeFavourite(character.id)">X</button></td>
          </template>
        </tr>
      </template>

      <template v-else-if="buttonClicked.episode && result && result.charactersByIds" >
        <tr v-for="character in result.charactersByIds" :key="character.id">
          <template v-for="episodeId in character.episode" :key="episodeId.id">
            <template v-if="episodeId.id == id.nameAndEpisodeId">
              <td v-if="character.status == 'Alive'"><img :src="`${character.image}`"></td>
              <td v-else-if="character.status == 'Dead'"><img class="dead" :src="`${character.image}`"></td>
              <td v-else-if="character.status == 'unknown'"><img class="unknown" :src="`${character.image}`"></td>
              <td>{{ character.id }}</td>
              <td>{{ character.name }}</td>
              <td>{{ character.gender }}</td>
              <td>{{ character.species }}</td>
              <td>{{ character.episode[character.episode.length-1].episode }}</td>
              <td><button type="button" class="dropdelbtn rounded" v-on:click="removeFavourite(character.id)">X</button></td>
            </template>
          </template>
        </tr>
      </template>

    </table>
  </div>
</template>

<script lang="ts">

import gql from 'graphql-tag'
import { defineComponent, reactive } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import favs from '../components/FavouriteFunctions';
import SearchBar from '../components/SearchBar.vue';

const FAVOURITES_QUERY = gql`
    query CharactersByIds ($ids: [ID!]!) {
      charactersByIds (ids: $ids) {
        id
        name
        image
        status
        gender
        species
        episode {
          id
          episode
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

    function setFavourites() {
      variables.ids = favs.getFavourites()
    }

    return {
      result,
      loading,
      error,
      setFavourites,
      favs
    }
  },

  methods: {

    isFavourites() {
      if (favs.getFavourites().length > 0) return true
      else return false
    },

    removeFavourite(id: number) {
      favs.deleteFavourite(id)
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