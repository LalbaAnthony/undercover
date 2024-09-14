import { defineStore } from 'pinia'

export const useUndercoverStore = defineStore('undercover', {
  state: () => ({
    words: [],
  }),

  actions: {
    async fetchWordsList () {
      fetch('src/ressources/words.json')
        .then((response) => response.json())
        .then((data) => {
          this.words = data.words
        }
      )
    },

    pickRandomWord () {
      const randomIndex = Math.floor(Math.random() * this.words.length)
      return this.words[randomIndex]
    },
  },
})
