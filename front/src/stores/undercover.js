import { defineStore } from 'pinia'
import { notif } from '@/composables/notif.js'
import { ucfirst } from '@/composables/helpers.js'
import { VITE_DEBUG } from '@/config';
import router from '@/router'

export const useUndercoverStore = defineStore('undercover', {
  persist: true,
  state: () => ({
    // * Constants
    DEBUG: VITE_DEBUG || VITE_DEBUG == 'true' || VITE_DEBUG === '1' || false,
    NUMBER_ROUNDS_MIN: 1,
    NUMBER_ROUNDS_MAX: 999,
    NUMBER_PLAYERS_MIN: 3,
    NUMBER_PLAYERS_MAX: 20,

    // * Game data
    allWords: [],
    allRoles: {},
    allDistributions: {},

    // * Game state
    distribution: { civilian: 0, undercover: 0, white: 0, },
    players: [],
    currentPlayer: 0,
    currentRound: 1,
    isGameRunning: false,
    undercoversWord: '',
    civilianWord: '',
    mrWhiteGuess: '',
  }),
  actions: {
    async fetchAllWords() {
      if (this.allWords.length > 0) return
      fetch('ressources/words.json')
        .then((response) => response.json())
        .then((data) => {
          this.allWords = data
        })
    },

    async fetchAllRoles() {
      if (this.allRoles.length > 0) return
      fetch('ressources/roles.json')
        .then((response) => response.json())
        .then((data) => {
          this.allRoles = data
        })
    },

    async fetchAllDistributions() {
      if (this.allDistributions.length > 0) return
      fetch('ressources/distributions.json')
        .then((response) => response.json())
        .then((data) => {
          this.allDistributions = data
        })
    },

    async fetchEverything() {
      await this.fetchAllWords()
      await this.fetchAllRoles()
      await this.fetchAllDistributions()
    },

    getRole(role) {
      if (!this.allRoles[role]) {
        console.error('Role does not exist')
        return {}
      }
      return this.allRoles[role]
    },

    nameExistInPlayers(name) {
      if (!name || name.length === 0) return false
      if (this.players.length === 0) return false

      if (this.players.some((player) => player.name === name)) {
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
      this.clearPalyersRoles()
    },

    deleteAll() {
      localStorage.clear()
      sessionStorage.clear()
    },

    resetAll() {
      this.clearPlayers()
      this.resetGame()
      this.initSetup()
    },

    endGame() {
      this.resetGame()
      router.push({ name: 'setup' })
    },

    initSetup() {
      this.fetchAllWords()
      this.fetchAllRoles()
      this.fetchAllDistributions()
      this.fillDistribution()
    },

    generateId() {
      return parseInt(new Date().getTime()) // Unsecure as hell, but enough for this game
    },

    addPlayer(name, password = '') {
      name = ucfirst(name.trim()) || ''
      password = (password?.length > 0) ? password.trim() : null

      if (name.length === 0) {
        notif.notify('Le nom du joueur ne peut pas être vide', 'error')
        console.error('The player name cannot be empty')
        return false
      }

      if (name.length > 20) {
        notif.notify('La t\'abuse sur la longueur du nom du joueur', 'error')
        console.error('The player name cannot be longer than 40 characters')
        return false
      }

      if (password && password.length > 20) {
        notif.notify('La t\'abuse sur la longueur du mot de passe', 'error')
        console.error('The player password cannot be longer than 20 characters')
        return false
      }

      if (this.nameExistInPlayers(name)) {
        notif.notify('Ce nom de joueur est déjà pris', 'error')
        console.error('Name already exists')
        return false
      }

      this.players.push({
        id: this.generateId(),
        name,
        password,
        role: null,
        eliminated: false,
      })

      this.fillDistribution()
    },

    eliminatePlayer(id) {
      const player = this.getPlayer(id)
      if (!player || player?.eliminated) {
        console.error('Player does not exist or is already eliminated')
        return false
      }

      player.eliminated = true
    },

    deletePlayer(id) {
      this.players = this.players.filter((player) => player.id !== id);
      this.fillDistribution()
    },

    getPlayer(id) {
      return this.players.find((player) => player.id === id)
    },

    getPlayerWord(id) {
      const role = this.getPlayer(id)?.role || ''
      let word = ''

      if (role === 'civilian') {
        word = this.civilianWord
      } else if (role === 'undercover') {
        word = this.undercoversWord
      } else if (role === 'white') {
        // Mr White does not have a word
      }

      return ucfirst(word)
    },

    incrementRound() {
      if (this.currentRound >= this.NUMBER_ROUNDS_MAX) {
        console.error('Maximum number of rounds reached')
        notif.notify('Nombre maximum de tours atteint', 'error')
        return false
      }

      this.currentRound++
    },

    canDecrementDistribution(role) {
      if (this.distribution[role] > 0) {
        return true
      }

      return false
    },

    canIncrementDistribution() {
      if (this.numberOfPlayers === 0) {
        return false
      } else if (this.numberDistribution + 1 > this.numberOfPlayers) {
        return false
      }

      return true
    },

    decrementDistribution(role) {
      if (this.canDecrementDistribution(role)) {
        this.distribution[role]--
      }
    },

    incrementDistribution(role) {
      if (this.canIncrementDistribution) {
        this.distribution[role]++
      }
    },

    fillDistribution() {
      if (this.numberOfPlayers >= this.NUMBER_PLAYERS_MIN && this.numberOfPlayers <= this.NUMBER_PLAYERS_MAX) {
        this.distribution = {
          civilian: this.allDistributions[String(this.numberOfPlayers)].civilian,
          undercover: this.allDistributions[String(this.numberOfPlayers)].undercover,
          white: this.allDistributions[String(this.numberOfPlayers)].white
        }
      } else {
        this.distribution = {
          civilian: 0,
          undercover: 0,
          white: 0
        }
      }
    },

    setRolesFromDistribution() {
      // Set randomly the roles for each player
      const roles = []
      for (let i = 0; i < this.distribution.civilian; i++) {
        roles.push('civilian')
      }
      for (let i = 0; i < this.distribution.undercover; i++) {
        roles.push('undercover')
      }
      for (let i = 0; i < this.distribution.white; i++) {
        roles.push('white')
      }

      // Shuffle the roles
      roles.sort(() => Math.random() - 0.5)

      // Assign the roles to the players
      for (let i = 0; i < this.players.length; i++) {
        this.players[i].role = roles[i]
      }

      // Assignate the words to the roles
    },

    distributionMatchPlayersNumber() {
      if (this.numberDistribution !== this.numberOfPlayers) {
        return true
      }

      return false
    },

    async assignRoles() {
      if (this.numberDistribution !== this.numberOfPlayers) {
        console.error('Number of roles does not match the number of players')
        return false
      }

      // ...

      return true
    },

    startGame() {
      if (this.numberOfPlayers < this.NUMBER_PLAYERS_MIN) {
        notif.notify('Il faut au moins 3 joueurs pour commencer une partie', 'error')
        console.error('Not enough players to start the game')
        return false
      }

      if (this.numberOfPlayers > this.NUMBER_PLAYERS_MAX) {
        notif.notify('Il y a clairement trop de joueurs pour jouer à ce jeu, faites un match de foot', 'error')
        console.error('Too many players to start the game')
        return false
      }

      if (this.distributionMatchPlayersNumber()) {
        notif.notify('Le nombre de rôles ne correspond pas au nombre de joueurs', 'error')
        console.error('Number of roles does not match the number of players')
        return false
      }

      if (this.distribution.civilian < this.getRole('civilian')?.numberMinPlayerRequired) {
        notif.notify('Il faut au moins un civil pour commencer une partie', 'error')
        return false
      }

      if (this.distribution.undercover < this.getRole('undercover')?.numberMinPlayerRequired) {
        notif.notify('Il faut au moins un undercover pour commencer une partie', 'error')
        return false
      }

      this.resetGame()
      this.isGameRunning = true

      router.push({ name: 'game' })
      this.setRolesFromDistribution()
      this.assignateWords()
    },

    getRandomAllWords() {
      const randomIndex = Math.floor(Math.random() * this.allWords.length)
      return this.allWords[randomIndex]
    },

    assignateWords() {
      const words = this.getRandomAllWords()
      if (Math.random() > 0.5) {
        this.undercoversWord = words[0]
        this.civilianWord = words[1]
      } else {
        this.undercoversWord = words[1]
        this.civilianWord = words[0]
      }
    },

    printGameState() {
      console.log('='.repeat(40))
      console.log('DEBUG', this.DEBUG)
      console.log('NUMBER_ROUNDS_MIN', this.NUMBER_ROUNDS_MIN)
      console.log('NUMBER_ROUNDS_MAX', this.NUMBER_ROUNDS_MAX)
      console.log('NUMBER_PLAYERS_MIN', this.NUMBER_PLAYERS_MIN)
      console.log('NUMBER_PLAYERS_MAX', this.NUMBER_PLAYERS_MAX)
      console.log('-'.repeat(40))
      console.log('undercoversWord', this.undercoversWord)
      console.log('civilianWord', this.civilianWord)
      console.log('-'.repeat(40))
      console.table(this.players)
      console.log('-'.repeat(40))
      console.log('distribution', this.distribution)
      console.log('currentPlayer', this.currentPlayer)
      console.log('currentRound', this.currentRound)
      console.log('isGameRunning', this.isGameRunning)
      console.log('='.repeat(40))
    }
  },
  getters: {
    numberOfPlayers() {
      return this.players.length
    },

    numberOfPlayersEliminated() {
      return this.players.filter((player) => player.eliminated).length
    },

    numberOfPlayersRemaining() {
      return this.players.filter((player) => !player.eliminated).length
    },

    numberDistribution() {
      let total = 0;
      for (const role in this.distribution) {
        if (Object.prototype.hasOwnProperty.call(this.distribution, role)) {
          total += this.distribution[role];
        }
      }

      return total;
    },

    numberOfPlayersCivilians() {
      return this.players.filter((player) => player.role === 'civilian').length
    },

    numberOfPlayersUndercovers() {
      return this.players.filter((player) => player.role === 'undercover').length
    },

    numberOfPlayersMrWhite() {
      return this.players.filter((player) => player.role === 'white').length
    },

    isGameOver() {
      const hasMrWhiteWon = (this.numberOfPlayersMrWhite > 0) && (this.mrWhiteGuess === this.civilianWord)
      const hasUndercoverWon = (this.numberOfPlayersCivilians === 0)
      const hasCivilianWon = (this.numberOfPlayersUndercovers === 0)
      const roundOver = (this.currentRound > this.NUMBER_ROUNDS_MAX)

      return hasMrWhiteWon || hasUndercoverWon || hasCivilianWon || roundOver;
    },
  }
});
