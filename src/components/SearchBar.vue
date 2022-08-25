<template>
  <div>
    <div class="dropdown">
      <button v-if="buttonClicked.name" v-on:click="toggleContent()" type="button" class="dropbtn static-width">Name</button>
      <button v-else-if="buttonClicked.id" v-on:click="toggleContent()" type="button" class="dropbtn static-width">ID</button>
      <button v-else-if="buttonClicked.episode" v-on:click="toggleContent()" type="button" class="dropbtn static-width">Episode</button>
      <div id="myDropdown" class="dropdown-content">
        <a href="#" v-on:click="buttonClicked.name = true, buttonClicked.id = false, buttonClicked.episode = false">Name</a>
        <a href="#" v-on:click=" buttonClicked.name = false, buttonClicked.id = true, buttonClicked.episode = false">ID</a>
        <a href="#" v-on:click=" buttonClicked.name = false, buttonClicked.id = false, buttonClicked.episode = true">Episode</a>
      </div>
    </div>
    <input type="text" placeholder="Input Text" class="dropbtn" style="border-radius: 10px 10px 10px 10px;" v-model=input>
    <button v-on:click="
    $emit('pass-search-bar-data', { name: buttonClicked.name, id: buttonClicked.id, episode: buttonClicked.episode, input, page }),
    $emit('initialize-input'),
    input = ''" type="button" class="dropbtn" style="margin-right: 20px;"> Execute </button>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

// close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!(event.target as HTMLButtonElement).matches('.dropbtn') && document.getElementById("myDropdown")?.classList.contains('show')) {
    document.getElementById("myDropdown")?.classList.remove('show')
  }
}

export default defineComponent({

  name: 'SearchBar',
  components: {
  },

  data() {
    return {
      page: 1,
      input: '',
      buttonClicked: { name: true, id: false, episode: false }
    }
  },

  methods: {
// When the user clicks on the button, toggle between hiding and showing the dropdown content
    toggleContent() {
      document.getElementById("myDropdown")?.classList.toggle("show")
    }
  }
});

</script>

<style>
/* Dropdown Button */
.dropbtn {
  background-color: #11B0C8;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

/* Dropdown button on hover & focus */
.dropbtn:hover,
.dropbtn:focus {
  background-color: #0e889b;
}

.dropdelbtn {
  background-color: #FF0F0F;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

/* Dropdown button on hover & focus */
.dropdelbtn:hover,
.dropdelbtn:focus {
  background-color: #b80e0e
}

.droptxt {
  background-color: #11b0c846;
  color: white;
  padding: 16px;
  font-size: 16px;
}

.static-width {
  width: 94px;
  margin-top: 10px;
  margin-bottom: 10px;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background-color: #ddd
}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {
  display: block;
}

.dead {
    filter: grayscale(100%);
}

.unknown {
    filter: blur(2px);
}

button {
  border-radius: 10px 10px 10px 10px;
  margin: 15px;
}

img {
  width: 100px;
  border-radius: 5px 5px 5px 5px;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  border-left-style: none;
  border-right-style: none;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #e2e2e225;
}
</style>