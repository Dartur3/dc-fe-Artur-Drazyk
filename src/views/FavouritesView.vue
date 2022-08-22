<template>
  <div>
    <SearchBar />
    <div v-if="isFavourites()">
      <p v-if="error">Something went wrong...</p>
      <p v-else-if="loading">Loading...</p>
      <div v-else-if="result && result.charactersByIds" v-for="character in result.charactersByIds" :key="character.id">
        <img :src="`${character.image}`">
        <p class="inline">{{ character.id }} {{ character.name }}</p>
        <button type="button" class="inline" v-on:click="removeFavourite(character.id)">X</button>
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
      }
    }
  `
export default defineComponent({

  name: 'FavouritesView',

  components: {
    SearchBar
  },

  setup() {

    const variables = reactive({
      ids: getFavourites()
    })

    const { result, loading, error } = useQuery(FAVOURITES_QUERY, variables)

    return {
      result,
      loading,
      error
    }

  },

  methods: {

    isFavourites() {
      if (getFavourites().length > 0) return true
      else return false
    },

    removeFavourite(id: number) {
      deleteFavourite(id)
    }
  }
})
</script>