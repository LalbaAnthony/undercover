import { defineStore } from 'pinia'
import { notif } from '@/composables/notif.js'
import { beautify } from '@/composables/helpers.js'
import { randomInt } from '@/composables/helpers.js'
import { shuffle } from '@/composables/helpers.js'
import { hasInternetConnection } from '@/composables/helpers.js'
import { nextTick } from 'vue'
import router from '@/router'
import md5 from 'crypto-js/md5'

export const useUndercoverStore = defineStore('undercover', {
  persist: true,
  state: () => ({
    // * Constants
    DEBUG_ACTIVE: false,
    ROUNDS_NB_MIN: 1,
    ROUNDS_NB_MAX: 999,
    PLAYERS_NB_MIN: 3,
    PLAYERS_NB_MAX: 20,
    WORDS_ATTEMPTS_NB_MAX: 50,

    // * Static data
    allWords: [],
    allRoles: {},
    allDistributions: {},

    // * Dynamic data
    playedWordsHashs: [],

    // * Settings
    settings: {
      canWhiteStart: false, // If Mr White can start the game
      randomStartingPlayer: false, // If the starting player is random
      randomOrder: false, // If the order of players is random
    },

    // * Game state
    distribution: { civilian: 0, undercover: 0, white: 0, },
    players: [],
    currentRound: 1,
    isGameRunning: false,
    undercoversWord: '',
    civilianWord: '',
    whiteGuess: '',
  }),
  actions: {
    async fetchAllWords(force = false) {
      if (this.allWords && this.allWords.length > 0 && !force) return
      fetch('ressources/words.json')
        .then((response) => response.json())
        .then((data) => {
          this.allWords = data
        })
    },

    async fetchAllRoles(force = false) {
      if (this.allRoles && this.allRoles.length > 0 && !force) return
      fetch('ressources/roles.json')
        .then((response) => response.json())
        .then((data) => {
          this.allRoles = data
        })
    },

    async fetchAllDistributions(force = false) {
      if (this.allDistributions && this.allDistributions.length > 0 && !force) return
      fetch('ressources/distributions.json')
        .then((response) => response.json())
        .then((data) => {
          this.allDistributions = data
        })
    },

    async fetchEverything(force = false) {
      if (!hasInternetConnection()) {
        console.error('Cannot fetch data, no internet connection')
        return
      }

      await this.fetchAllWords(force)
      await this.fetchAllRoles(force)
      await this.fetchAllDistributions(force)
    },

    getRole(role) {
      if (!this.allRoles[role]) return {}
      return this.allRoles[role]
    },

    numberOfPlayersByRole(role) {
      return this.players.filter((player) => player.role === role).length
    },

    numberOfPlayersEliminatedByRole(role) {
      return this.players.filter((player) => player.role === role && player.eliminated).length
    },

    numberOfPlayersRemainingByRole(role) {
      return this.players.filter((player) => player.role === role && !player.eliminated).length
    },

    nameExistInPlayers(name) {
      if (!name || name.length === 0) return false
      if (this.players.length === 0) return false

      if (this.players.some((player) => player.name === name)) {
        return true
      }

      return false
    },

    areAllNamesUnique() {
      const names = this.players.map(player => player.name)
      const uniqueNames = new Set(names)
      return names.length === uniqueNames.size
    },

    clearPlayers() {
      this.players = []
    },

    resetSettings() {
      for (const key in this.settings) {
        if (Object.prototype.hasOwnProperty.call(this.settings, key)) {
          this.settings[key] = false
        }
      }
    },

    clearPlayersRoles() {
      for (const player of this.players) {
        player.role = null
      }
    },

    reviveAllPlayers() {
      for (const player of this.players) {
        player.eliminated = false
      }
    },

    startGame() {
      if (this.numberOfPlayers < this.PLAYERS_NB_MIN) {
        notif.notify('Il faut au moins 3 joueurs pour commencer une partie', 'error')
        console.error('Not enough players to start the game')
        return false
      }

      if (this.numberOfPlayers > this.PLAYERS_NB_MAX) {
        notif.notify('Il y a clairement trop de joueurs pour jouer à ce jeu, faites un match de foot', 'error')
        console.error('Too many players to start the game')
        return false
      }

      if (this.numberOfInDistribution !== this.numberOfPlayers) {
        notif.notify('Le nombre de rôles ne correspond pas au nombre de joueurs', 'error')
        console.error('Number of roles does not match the number of players')
        return false
      }

      if (!this.areAllNamesUnique) {
        notif.notify('Tous les noms de joueurs doivent être uniques', 'error')
        console.error('All player names must be unique')
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

      if (this.settings.randomOrder) this.shufflePlayers()

      router.push({ name: 'game' })
      this.setRolesFromDistribution()
      this.assignateWords()
    },

    async stopGame() {
      this.isGameRunning = false
      await nextTick()
      router.push({ name: 'over' })
    },

    resetGame() {
      this.currentRound = 1
      this.isGameRunning = false
      this.undercoversWord = ''
      this.civilianWord = ''
      this.whiteGuess = ''
      this.reviveAllPlayers()
      this.clearPlayersRoles()
    },

    resetAll() {
      this.clearPlayers()
      this.resetSettings()
      this.resetGame()
      this.fetchEverything(false)
    },

    restartGame() {
      this.resetGame()
      router.push({ name: 'setup' })
    },

    generateId() {
      return parseInt(new Date().getTime()) // Unsecure as hell, but enough for this game
    },

    addPlayer(name, password = '') {
      name = beautify(name)
      password = (password?.length > 0) ? password.trim() : null

      if (!name || name.length === 0) {
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

      this.autofillDistribution()
    },

    eliminatePlayer(id) {
      const player = this.getPlayer(id)
      if (!player || player?.eliminated) {
        console.error('Player does not exist or is already eliminated')
        return false
      }

      if (player.role === 'white') {
        while (this.whiteGuess.length === 0) {
          this.whiteGuess = beautify(prompt('Entrez le mot que Mr White pense être le bon', ''))
        }
        if (this.whiteGuess.length === 0) {
          notif.notify('Le mot de Mr White ne peut pas être vide', 'error')
          console.error('Mr White word cannot be empty')
          return false
        }
      }

      player.eliminated = true

      // TODO Issue decomenting here
      // if (this.isGameOver) {
      //   this.stopGame()
      //   return true
      // }

      this.nextRound()

      return true
    },


    deletePlayer(id) {
      this.players = this.players.filter((player) => player.id !== id);
      this.autofillDistribution()
    },

    getPlayer(id) {
      return this.players.find((player) => player.id === id)
    },

    getPlayerMustBegin() {
      if (this.settings.randomStartingPlayer) {
        let rolesToExclude = []
        if (!this.settings.canWhiteStart && this.currentRound <= 1) {
          rolesToExclude.push('white')
        }
        return this.getRandomPlayer(rolesToExclude)
      }

      return this.getFirstPlayer() // Default to the first player
    },

    getFirstPlayer() {
      if (this.players.length === 0) return null
      return this.players[0]
    },

    getRandomPlayer(rolesToExclude = []) {
      const filteredPlayers = this.players.filter((player) => !rolesToExclude.includes(player.role))
      if (filteredPlayers.length === 0) return null
      return filteredPlayers[randomInt(0, filteredPlayers.length - 1)];
    },

    getPlayerWord(id) {
      const role = this.getPlayer(id)?.role || ''
      let word = ''

      if (role === 'civilian') {
        word = this.civilianWord
      } else if (role === 'undercover') {
        word = this.undercoversWord
      } else if (role === 'white') {
        word = ''
      }

      return beautify(word)
    },

    incrementRound() {
      if (this.roundOver) {
        console.error('Maximum number of rounds reached')
        return false
      }

      this.currentRound++

      return true
    },

    nextRound() {
      if (this.settings.randomOrder) this.shufflePlayers()
      this.incrementRound()
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
      } else if (this.numberOfInDistribution + 1 > this.numberOfPlayers) {
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

    autofillDistribution() {
      if (this.numberOfPlayers >= this.PLAYERS_NB_MIN && this.numberOfPlayers <= this.PLAYERS_NB_MAX) {
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

    async assignRoles() {
      if (this.numberOfInDistribution !== this.numberOfPlayers) {
        console.error('Number of roles does not match the number of players')
        return false
      }

      // ...

      return true
    },

    shufflePlayers() {
      this.players = shuffle(this.players)
    },

    hasPlayedWords(string1 = '', string2 = '') {
      if (!string1 || !string2) return true;
      const hash = md5(string1 + string2).toString()
      return this.playedWordsHashs.includes(hash)
    },

    addToPlayedWords(string1 = '', string2 = '') {
      if (!string1 || !string2) return;
      const hash = md5(string1 + string2).toString()
      this.playedWordsHashs.push(hash)
    },

    getRandomAllWords() {
      let words = []
      let i = 0

      while (((!words[0] || !words[1]) || this.hasPlayedWords(words[0], words[1])) && i < this.WORDS_ATTEMPTS_NB_MAX) {
        const index = randomInt(0, this.allWords.length - 1)
        words = this.allWords[index]
        i++
      }

      this.addToPlayedWords(words[0], words[1])

      words = words.map(word => beautify(word))

      return words
    },

    assignateWords() {
      const words = this.getRandomAllWords()
      const shuffled = words.sort(() => Math.random() - 0.5)

      this.undercoversWord = shuffled[0]
      this.civilianWord = shuffled[1]
    },

    debugGameState() {
      console.log('-'.repeat(40))
      console.log('undercoversWord', this.undercoversWord)
      console.log('civilianWord', this.civilianWord)
      console.log('whiteGuess', this.whiteGuess)
      console.log('-'.repeat(40))
      console.table(this.players)
      console.log('-'.repeat(40))
      console.table(this.settings)
      console.log('-'.repeat(40))
      console.log('distribution', this.distribution)
      console.log('currentRound', this.currentRound)
      console.log('isGameRunning', this.isGameRunning)
      console.log('-'.repeat(40))
      console.log('numberOfInDistribution', this.numberOfInDistribution)
      console.log('numberOfPlayers', this.numberOfPlayers)
      console.log('numberOfPlayersEliminated', this.numberOfPlayersEliminated)
      console.log('numberOfPlayersRemaining', this.numberOfPlayersRemaining)
      console.log('numberOfCivilians', this.numberOfCivilians)
      console.log('numberOfUndercovers', this.numberOfUndercovers)
      console.log('numberOfWhite', this.numberOfWhite)
      console.log('numberOfCiviliansRemaining', this.numberOfCiviliansRemaining)
      console.log('numberOfUndercoversRemaining', this.numberOfUndercoversRemaining)
      console.log('numberOfWhiteRemaining', this.numberOfWhiteRemaining)
      console.log('hasWhiteWon', this.hasWhiteWon)
      console.log('hasUndercoverWon', this.hasUndercoverWon)
      console.log('hasCivilianWon', this.hasCivilianWon)
      console.log('roundOver', this.roundOver)
      console.log('isGameOver', this.isGameOver)
      console.log('='.repeat(40))
    }
  },
  getters: {
    numberOfInDistribution() {
      let total = 0;
      for (const role in this.distribution) {
        if (Object.prototype.hasOwnProperty.call(this.distribution, role)) {
          total += this.distribution[role];
        }
      }

      return total;
    },

    numberOfPlayers() {
      return this.players.length
    },

    numberOfPlayersEliminated() {
      return this.players.filter((player) => player.eliminated).length
    },

    numberOfPlayersRemaining() {
      return this.players.filter((player) => !player.eliminated).length
    },

    numberOfCivilians() {
      return this.players.filter((player) => player.role === 'civilian').length
    },

    numberOfUndercovers() {
      return this.players.filter((player) => player.role === 'undercover').length
    },

    numberOfWhite() {
      return this.players.filter((player) => player.role === 'white').length
    },

    numberOfCiviliansRemaining() {
      return this.players.filter((player) => player.role === 'civilian' && !player.eliminated).length
    },

    numberOfUndercoversRemaining() {
      return this.players.filter((player) => player.role === 'undercover' && !player.eliminated).length
    },

    numberOfWhiteRemaining() {
      return this.players.filter((player) => player.role === 'white' && !player.eliminated).length
    },

    hasWhiteWon() {
      const whiteGuessCorrect = this.whiteGuess === this.civilianWord
      const atLeastOneWhiteRemaining = this.numberOfWhiteRemaining > 0
      return (whiteGuessCorrect && atLeastOneWhiteRemaining) || (this.numberOfCiviliansRemaining === 0 && this.numberOfUndercoversRemaining === 0)
    },

    hasUndercoverWon() {
      const atLeastOneUndercoverRemaining = this.numberOfUndercoversRemaining > 0
      const moreUndercoversThanCivilians = this.numberOfUndercoversRemaining > this.numberOfCiviliansRemaining
      return atLeastOneUndercoverRemaining && moreUndercoversThanCivilians
    },

    hasCivilianWon() {
      const atLeastOneCivilianRemaining = this.numberOfCiviliansRemaining > 0
      const moreCiviliansThanUndercovers = this.numberOfCiviliansRemaining > this.numberOfUndercoversRemaining
      const everyWhiteEliminated = this.numberOfWhiteRemaining === 0
      const everyUndercoversEliminated = this.numberOfUndercoversRemaining === 0
      return atLeastOneCivilianRemaining && moreCiviliansThanUndercovers && everyWhiteEliminated && everyUndercoversEliminated
    },

    roundOver() {
      return (this.currentRound > this.ROUNDS_NB_MAX);
    },

    isGameOver() {
      const noPlayersRemaining = this.numberOfPlayersRemaining === 0
      return this.hasWhiteWon || this.hasUndercoverWon || this.hasCivilianWon || this.roundOver || noPlayersRemaining
    },
  },
});
