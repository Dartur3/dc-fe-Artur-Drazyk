<template>
  <button v-if="page > 1" type="button" class="droptxt" v-on:click="setPage(--page)">-</button>
  <button v-else type="button" class="droptxt">-</button>
  <button v-if="resultNames && resultNames.characters.info && page < resultNames.characters.info.count / 20"
    type="button" class="droptxt" v-on:click="setPage(++page)">+</button>
  <button v-else type="button" class="droptxt">+</button>

  <SearchBar v-on:pass-search-bar-data="passSearchBarData" v-on:initialize-input="setName(id.name), setNameAndEpisodeId(id.nameAndEpisodeId), setPage(page)" />

  <p v-if="errorNames || errorId || errorEpisode">Something went wrong...</p>
  <p v-else-if="loadingNames || loadingId || loadingEpisode">Loading...</p>

  <table>
    <tr>
      <th>Photos</th>
      <th>Character ID</th>
      <th>Name</th>
      <th>Gender</th>
      <th>Species</th>
      <th>Last Episode</th>
      <th>Favourites</th>
    </tr>

    <template v-if="buttonClicked.name && resultNames && resultNames.characters.results">
        <tr v-for="character in resultNames.characters.results" :key="character.id">
          <td v-if="character.status == 'Alive'"><img :src="`${character.image}`"></td>
          <td v-else-if="character.status == 'Dead'"><img class="dead" :src="`${character.image}`"></td>
          <td v-else-if="character.status == 'unknown'"><img class="unknown" :src="`${character.image}`"></td>
          <td>{{ character.id }}</td>
          <td>{{ character.name }}</td>
          <td>{{ character.gender }}</td>
          <td>{{ character.species }}</td>
          <td>{{ character.episode[character.episode.length-1].episode }}</td>
          <td v-if="favs.getFavourites().indexOf(character.id) === -1"><button type="button" v-on:click="favs.addFavourite(character.id)">&#9829;</button></td>
          <td v-else><button type="button" v-on:click="favs.deleteFavourite(character.id)">X</button></td>
        </tr>
    </template>

    <tr v-else-if="buttonClicked.id && resultId && resultId.character">
      <td v-if="resultId.character.status == 'Alive'"><img :src="`${resultId.character.image}`"></td>
      <td v-else-if="resultId.character.status == 'Dead'" class="dead"><img :src="`${resultId.character.image}`"></td>
      <td v-else-if="resultId.character.status == 'unknown'" class="unknown"><img :src="`${resultId.character.image}`"></td>
      <td>{{ resultId.character.id }}</td>
      <td>{{ resultId.character.name }}</td>
      <td>{{ resultId.character.gender }}</td>
      <td>{{ resultId.character.species }}</td>
      <td>{{ resultId.character.episode[resultId.character.episode.length-1].episode }}</td>
      <td v-if="favs.getFavourites().indexOf(resultId.character.id) === -1"><button type="button" v-on:click="favs.addFavourite(resultId.character.id)">&#9829;</button></td>
      <td v-else><button type="button" v-on:click="favs.deleteFavourite(resultId.character.id)">X</button></td>
    </tr>

    <template v-else-if="buttonClicked.episode && resultEpisode && resultEpisode.episode.characters">
      <tr v-for="character in resultEpisode.episode.characters" :key="character.id">
        <td v-if="character.status == 'Alive'"><img :src="`${character.image}`"></td>
        <td v-else-if="character.status == 'Dead'"><img class="dead" :src="`${character.image}`"></td>
        <td v-else-if="character.status == 'unknown'"><img class="unknown" :src="`${character.image}`"></td>
        <td>{{ character.id }}</td>
        <td>{{ character.name }}</td>
        <td>{{ character.gender }}</td>
        <td>{{ character.species }}</td>
        <td>{{ character.episode[character.episode.length-1].episode }}</td>
        <td v-if="favs.getFavourites().indexOf(character.id) === -1"><button type="button" v-on:click="favs.addFavourite(character.id)">&#9829;</button></td>
        <td v-else><button type="button" v-on:click="favs.deleteFavourite(character.id)">X</button></td>
      </tr>
    </template>

  </table>
</template>

<script lang="ts">

import gql from 'graphql-tag'
import favs from '../components/FavouriteFunctions';
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
          status
          gender
          species
          episode {
            episode
          }
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
        status
        gender
        species
        episode {
          episode
        }
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
          status
          gender
          species
          episode {
            episode
          }
        }
      }
    }
  `

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
      buttonClicked: { name: true, id: false, episode: false }
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
      favs
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