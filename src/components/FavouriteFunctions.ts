import { reactive } from "vue"

const favourites: number[] = reactive(JSON.parse(localStorage.getItem("storedFavourites")!)) || reactive([])

function saveFavourites() {
  if (typeof(Storage) !== "undefined") localStorage.setItem('storedFavourites', JSON.stringify(favourites))
  if (JSON.parse(localStorage.getItem("storedFavourites")!).length == 0) localStorage.removeItem("storedFavourites")
}

const favs = {
  addFavourite(id: number) {
    favourites.push(id)
    saveFavourites()
  },
    
  deleteFavourite(id: number) {
    favourites.splice(favourites.indexOf(id), 1)
    saveFavourites()
  },
    
    getFavourites() {
    return favourites
  }
}

export default favs