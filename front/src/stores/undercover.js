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

    // * Game state
    distribution: { civilian: 0, undercover: 0, mrWhite: 0, },
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
      return this.numberMinOfPlayersReached() && this.numberMaxOfPlayersReached()
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
      this.fillDistributionWithSuggestion()
    },

    addPlayer(name) {
      if (name.length === 0) {
        notify('Le nom du joueur ne peut pas être vide', 'error')
        console.error('The player name cannot be empty')
        return false
      }

      if (name.length > 40) {
        notify('La t\'abuse sur la longueur du nom du joueur', 'error')
        console.error('The player name cannot be longer than 40 characters')
        return false
      }

      if (this.checkIfNameAlreadyExists(name)) {
        return false
      }

      if (this.numberMaxOfPlayersReached()) {
        return false
      }

      const timestamp = new Date().getTime()
      this.players.push({
        timestamp,
        name,
        role: null,
        eliminated: false,
      })
    },

    removePlayer(timestamp) {
      this.players = this.players.filter((player) => player.timestamp !== timestamp);
      this.checkDistributionIsWrong()
    },

    decrementDistribution(role) {
      if (this.distribution[role] > 0) {
        this.distribution[role]--
      }
    },

    incrementDistribution(role) {
      if (this.numberOfPlayers === 0) {
        notify('Ajoutez d\'abord des joueurs', 'error')
      } else if (this.distribution.civilian + this.distribution.undercover + this.distribution.mrWhite + 1 > this.numberOfPlayers) {
        notify('Tout le monde a déjà un rôle', 'error')
      } else {
        this.distribution[role]++
      }
    },

    fillDistributionWithSuggestion() {
      if (this.numberOfPlayers > this.NUMBER_MIN_OF_PLAYERS) {
        this.distribution = {
          civilian: this.allDistributions[String(this.numberOfPlayers)].civilian,
          undercover: this.allDistributions[String(this.numberOfPlayers)].undercover,
          mrWhite: this.allDistributions[String(this.numberOfPlayers)].mrWhite
        }
      }
    },

    checkDistributionIsWrong() {
      if (this.distribution.civilian + this.distribution.undercover + this.distribution.mrWhite !== this.numberOfPlayers) {
        notify('Le nombre de rôles ne correspond pas au nombre de joueurs', 'error')
        console.error('Number of roles does not match the number of players')
        return true
      }

      return false
    },

    async assignRoles() {
      if (this.distribution.civilian + this.distribution.undercover + this.distribution.mrWhite !== this.numberOfPlayers) {
        console.error('Number of roles does not match the number of players')
        return false
      }

      // ...

      return true
    },

    startGame() {
      const t1 = this.numberOfPlayersReached()
      const t2 = this.checkDistributionIsWrong()

      if (!t1 && !t2) {
        this.resetGame()
        this.isGameRunning = true

        router.push({ path: '/game' })
      }
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

    isGameOver() {
      return this.numberOfPlayersUndercovers === 0 || this.numberOfPlayersCivilians === 0
    },
  },
})
