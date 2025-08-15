import { defineStore } from 'pinia'
import { notif } from '@/composables/notif.js'
import { beautify } from '@/composables/helpers.js'
import { randomInt } from '@/composables/helpers.js'
import { shuffle } from '@/composables/helpers.js'
import { hasInternetConnection } from '@/composables/helpers.js'
import { useRoute } from 'vue-router'
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
    distribution: { civilian: 0, undercover: 0, white: 0, fool: 0 },
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

    clearWhiteGuess() {
      this.whiteGuess = ''
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

    reviveByRole(role) {
      for (const player of this.players) {
        if (player.role === role) {
          player.eliminated = false
        }
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
        notif.notify('Les nombres des rôles ne correspondent pas au nombre de joueurs', 'error')
        console.error('Number of roles does not match the number of players')
        return false
      }

      if (!this.areAllNamesUnique) {
        notif.notify('Tous les noms de joueurs doivent être uniques', 'error')
        console.error('All player names must be unique')
        return false
      }

      if (this.distribution.civilian < 1) {
        notif.notify('Il faut au moins un civil pour commencer une partie', 'error')
        return false
      }

      if (this.distribution.undercover < 1 && this.distribution.white < 1 && this.distribution.fool < 1) {
        notif.notify('Il faut au moins un undercover ou un Mr White ou un Fool pour commencer une partie', 'error')
        return false
      }

      for (const [key, value] of Object.entries(this.allRoles)) {
        const playersRequired = this.getRole(key)?.playersRequired
        const playersWithThisRole = this.getRole(key)?.playersWithThisRole

        if (playersRequired.min !== -1 && this.numberOfPlayers < playersRequired.min && this.numberOfPlayers > 0) {
          notif.notify(`Il faut au moins ${playersRequired.min} joueurs pour jouer avec un ${value.name}`, 'error')
          console.error(`Not enough players to play as ${value.name}`)
          return false
        }
        if (playersRequired.max !== -1 && this.numberOfPlayers > playersRequired.max && this.numberOfPlayers > 0) {
          notif.notify(`Il faut maximum ${playersRequired.max} joueurs pour jouer avec un ${value.name}`, 'error')
          console.error(`Too many players to play as ${value.name}`)
          return false
        }

        if (playersWithThisRole.min !== -1 && this.distribution[key] < playersWithThisRole.min) {
          notif.notify(`Il ne peut pas y avoir moins de ${playersWithThisRole.min} ${value.name} dans une partie`, 'error')
          console.error(`Not enough players with the role ${value.name}`)
          return false
        }
        if (playersWithThisRole.max !== -1 && this.distribution[key] > playersWithThisRole.max) {
          notif.notify(`Il ne peut pas y avoir plus de ${playersWithThisRole.max} ${value.name} dans une partie`, 'error')
          console.error(`Too many players with the role ${value.name}`)
          return false
        }
      }

      if (this.distribution.civilian <= (this.distribution.undercover + this.distribution.white)) {
        notif.notify('Il faut plus de civils que d\'undercover et de Mr White', 'error')
        console.error('Not enough civilians compared to undercovers and Mr White')
        return false
      }

      this.resetGame()
      this.isGameRunning = true

      if (this.settings.randomOrder) this.shufflePlayers()

      if (useRoute()?.name !== 'game') router.push({ name: 'game' })
      this.setRolesFromDistribution()
      this.assignateWords()
    },

    async stopGame() {
      this.isGameRunning = false
      if (useRoute()?.name !== 'over') router.push({ name: 'over' })
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
      if (useRoute()?.name !== 'setup') router.push({ name: 'setup' })
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
        if (this.hasWhiteMadeAGuess) {
          player.eliminated = true
          this.clearWhiteGuess() // Clear the guess after checking in case there is multiple Mr White
        } else {

          // Do nothing if Mr White has not made a guess yet, juste display the panel to let him guess
          return true
        }
      } else {
        player.eliminated = true
      }

      if (this.isGameOver) {
        notif.notify('La partie est terminée', 'info')
        setTimeout(() => {
          this.stopGame()
        }, 4000)
      } else {
        this.nextRound()
      }

      return true
    },

    checkForWhiteGuess(id) {
      if (!this.hasWhiteMadeAGuess) {
        notif.notify('La proposition de Mr White n\'est pas valide', 'error')
        console.error('Mr White has not made a guess yet')
        return false
      }

      if (this.hasWhiteWon) {
        notif.notify('Mr White a trouvé le mot des civils', 'info')
        setTimeout(() => {
          this.stopGame()
        }, 4000)

        return true
      }

      notif.notify('Le mot saisi par Mr White n\'est pas le bon, cheh.', 'info')

      this.eliminatePlayer(id)

      return false
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
      }
      if (role === 'fool') {
        word = this.civilianWord
      }
      if (role === 'undercover') {
        word = this.undercoversWord
      }
      if (role === 'white') {
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
          white: this.allDistributions[String(this.numberOfPlayers)].white,
          fool: this.allDistributions[String(this.numberOfPlayers)].fool
        }
      } else {
        this.distribution = {
          civilian: 0,
          undercover: 0,
          white: 0,
          fool: 0
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
      for (let i = 0; i < this.distribution.fool; i++) {
        roles.push('fool')
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
      console.log('hasWhiteWon', this.hasWhiteWon)
      console.log('hasUndercoverWon', this.hasUndercoverWon)
      console.log('hasCivilianWon', this.hasCivilianWon)
      console.log('hasFoolWon', this.hasFoolWon)
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

    hasWhiteMadeAGuess() {
      return (this.whiteGuess && this.whiteGuess.length > 0)
    },

    isWhiteGuessCorrect() {
      return (this.hasWhiteMadeAGuess && beautify(this.whiteGuess) === beautify(this.civilianWord))
    },

    hasWhiteWon() {
      const hasWhite = this.numberOfPlayersByRole('white') > 0
      if (!hasWhite) return false
      const nbOfWhite = this.numberOfPlayersRemainingByRole('white')
      const nbOfCivilian = this.numberOfPlayersRemainingByRole('civilian')
      return nbOfWhite > 0 && (this.isWhiteGuessCorrect || (nbOfWhite > nbOfCivilian))
    },

    hasUndercoverWon() {
      const hasUndercover = this.numberOfPlayersByRole('undercover') > 0
      if (!hasUndercover) return false
      const nbOfCivilian = this.numberOfPlayersRemainingByRole('civilian')
      const nbOfUndercover = this.numberOfPlayersRemainingByRole('undercover')
      return nbOfUndercover > 0 && (nbOfUndercover >= nbOfCivilian)
    },

    hasCivilianWon() {
      const hasCivilian = this.numberOfPlayersByRole('civilian') > 0
      if (!hasCivilian) return false
      const nbOfCivilian = this.numberOfPlayersRemainingByRole('civilian')
      const nbOfUndercover = this.numberOfPlayersRemainingByRole('undercover')
      const nbOfWhite = this.numberOfPlayersRemainingByRole('white')
      return nbOfCivilian > 0 && (nbOfUndercover === 0 && nbOfWhite === 0);
    },

    hasFoolWon() {
      const hasFool = this.numberOfPlayersByRole('fool') > 0
      if (!hasFool) return false
      const nbOfFool = this.numberOfPlayersRemainingByRole('fool')
      const onlyOneDeath = this.numberOfPlayersRemaining + 1 === this.numberOfPlayers
      return nbOfFool === 0 && onlyOneDeath
    },

    hasWhiteAndUndercoverWon() {
      return this.hasWhiteWon && this.hasUndercoverWon
    },

    roundOver() {
      return (this.currentRound > this.ROUNDS_NB_MAX);
    },

    isGameOver() {
      const noPlayersRemaining = this.numberOfPlayersRemaining === 0
      return this.hasWhiteWon || this.hasUndercoverWon || this.hasCivilianWon || this.hasFoolWon || this.roundOver || noPlayersRemaining
    },
  },
});
