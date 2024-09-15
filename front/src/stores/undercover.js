import { defineStore } from 'pinia'
import { notify } from '@/helpers/notif.js'
import router from '@/router'

export const useUndercoverStore = defineStore('undercover', {
  state: () => ({
    // persist: true,

    // * Constants
    NUMBER_MIN_OF_PLAYERS: 3,
    NUMBER_MAX_OF_PLAYERS: 20,

    // * Game data
    allWords: [],
    allRoles: {},
    allDistributions: {},
    playerTemplate: {
      name: '',
      role: null,
      eliminated: false,
    },

    // * Game settings
    numberOfCivilians: 3,
    numberOfUndercovers: 1,
    numberOfMrWhite: 1,

    // * Game state
    players: [],
    currentPlayer: 0,
    currentRound: 1,
    isGameRunning: false,
    undercoversWord: '',
    civilianWord: '',
  }),

  actions: {
    async fetchWordsList() {
      fetch('src/ressources/words.json')
        .then((response) => response.json())
        .then((data) => {
          this.allWords = data.words
          console.log('Words fetched')
        })
    },

    async fetchRolesList() {
      fetch('src/ressources/roles.json')
        .then((response) => response.json())
        .then((data) => {
          this.allRoles = data.roles
          console.log('Roles fetched')
        })
    },

    async fetchDistributionsList() {
      fetch('src/ressources/distributions.json')
        .then((response) => response.json())
        .then((data) => {
          this.allDistributions = data.distributions
          console.log('Distributions fetched')
        })
    },

    numberMinOfPlayersReached() {
      if (this.numberOfPlayers < this.NUMBER_MIN_OF_PLAYERS) {
        notify(`Il faut au moins ${this.NUMBER_MIN_OF_PLAYERS} joueurs pour commencer une partie`, 'error')
        console.error('Not enough players')
        return true
      }

      return false
    },

    numberMaxOfPlayersReached() {
      if (this.numberOfPlayers > this.NUMBER_MAX_OF_PLAYERS) {
        notify('Il y a clairement trop de joueurs pour jouer à ce jeu, faites un match de foot', 'error')
        console.error('Too many players')
        return true
      }

      return false
    },

    numberOfPlayersReached() {
      if (!this.numberMinOfPlayersReached()) return true
      if (!this.numberMaxOfPlayersReached()) return true

      return false
    },

    checkIfNameAlreadyExists(name) {
      if (!name) return false
      if (this.players.length === 0) return false

      if (this.players.some((player) => player.name === name)) {
        notify('Ce nom de joueur est déjà pris', 'error')
        console.error('Name already exists')
        return true
      }

      return false
    },

    clearPlayers() {
      this.players = []
    },

    clearPalyersRoles() {
      for (const player of this.players) {
        player.role = null
      }
    },

    resetGame() {
      this.currentPlayer = 0
      this.currentRound = 1
      this.isGameRunning = false
      this.undercoversWord = ''
      this.civilianWord = ''
    },

    resetAll() {
      this.clearPlayers()
      this.resetGame()
    },

    endGame() {
      this.clearPalyersRoles()
      this.resetGame()
      router.push({ path: '/' })
    },

    initSetup() {
      this.fetchWordsList()
      this.fetchRolesList()
      this.fetchDistributionsList()
      this.numberOfCivilians = this.suggestedNumberOfCivilians
      this.numberOfUndercovers = this.suggestedNumberOfUndercovers
      this.numberOfMrWhite = this.suggestedNumberOfMrWhite
    },

    addPlayer(name) {
      this.players.push({ ...this.playerTemplate, name })
    },

    async assignRoles() {
      if (this.numberOfCivilians + this.numberOfUndercovers + this.numberOfMrWhite !== this.numberOfPlayers) {
        console.error('Number of roles does not match the number of players')
        return false
      }

      // ...

      return true
    },

    startGame() {
      this.resetGame()

      if (this.numberOfPlayersReached()) return false

      this.isGameRunning = true
      this.currentPlayer = 0
      router.push({ path: '/game' })
    },

    pickRandomWordDuo() {
      const randomIndex = Math.floor(Math.random() * this.words.length)
      return this.words[randomIndex]
    },

    assignateWords() {
      const words = this.pickRandomWordDuo()
      if (Math.random() > 0.5) {
        this.undercoversWord = words[0]
        this.civilianWord = words[1]
      } else {
        this.undercoversWord = words[1]
        this.civilianWord = words[0]
      }
    },
  },
  getters: {
    numberOfPlayers() {
      return this.players.length
    },

    numberOfPlayersCivilians() {
      return this.players.filter((player) => player.role === 'civilian').length
    },

    numberOfPlayersUndercovers() {
      return this.players.filter((player) => player.role === 'undercover').length
    },

    numberOfPlayersMrWhite() {
      return this.players.filter((player) => player.role === 'mrWhite').length
    },

    suggestedNumberOfCivilians() {
      if (this.allDistributions && this.numberOfPlayers >= this.NUMBER_MIN_OF_PLAYERS) {
        this.allDistributions[String(this.numberOfPlayers)].civilians
      } else {
        return 2
      }
    },

    suggestedNumberOfUndercovers() {
      if (this.allDistributions && this.numberOfPlayers >= this.NUMBER_MIN_OF_PLAYERS) {
        this.allDistributions[String(this.numberOfPlayers)].undercovers
      } else {
        return 1
      }
    },
    suggestedNumberOfMrWhite() {
      if (this.allDistributions && this.numberOfPlayers >= this.NUMBER_MIN_OF_PLAYERS) {
        this.allDistributions[String(this.numberOfPlayers)].mrWhite
      } else {
        return 0
      }
    },

    isGameOver() {
      return this.numberOfPlayersUndercovers === 0 || this.numberOfPlayersCivilians === 0
    },
  },
})
