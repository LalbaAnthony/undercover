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
  
    async fetchRolesList () {
      fetch('src/ressources/roles.json')
        .then((response) => response.json())
        .then((data) => {
          this.roles = data.roles
        }
      )
    },

    pickRandomWord () {
      const randomIndex = Math.floor(Math.random() * this.words.length)
      return this.words[randomIndex]
    },
  },
})
