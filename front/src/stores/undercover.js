import { defineStore } from 'pinia'

export const useUndercoverStore = defineStore('undercover', {
  state: () => ({
    persist: true,
    words: [],
    roles: [],

    // Game state
    players: [],
    currentPlayer: null,
    currentRound: 1,
    isGameStarted: false,
    isGameFinished: false,
    numberOfPlayers: 3,

    // Game settings
    numberOfCivilians: 3,
    numberOfUndercovers: 1,
    numberOfMrWhite: 1,
    undercoversWord: '',
    civilianWord: '',
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

    addAPlayer (name) {
      this.players.push({ name: name, role: null })
    },

    async assignRoles () {
      if (this.players.length !== this.numberOfPlayers) {
        console.error('Number of players does not match the number of players selected')
        return
      }

      if (this.numberOfPlayers < 3) {
        console.error('Not enough players')
        return
      }

      if (this.numberOfPlayers > 20) {
        console.error('Too many players')
        return
      }

      if (this.numberOfCivilians + this.numberOfUndercovers + this.numberOfMrWhite !== this.numberOfPlayers) {
        console.error('Number of roles does not match the number of players')
        return
      }

      // ...
    },

    async startGame () {
      this.isGameStarted = true
      this.currentPlayer = this.players[0]
    },

    pickRandomWordDuo () {
      const randomIndex = Math.floor(Math.random() * this.words.length)
      return this.words[randomIndex]
    },

    assignateWords () {
      const words = this.pickRandomWordDuo()
      this.undercoversWord = words[0]
      this.civilianWord = words[1]
    },
  },
})
