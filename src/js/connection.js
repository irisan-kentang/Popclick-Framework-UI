import { io } from "socket.io-client"

const socket = io.connect(process.env.WS_URL, {secure: true})

let currentScore = localStorage.getItem('score')
currentScore = (currentScore == null) ? 0 : currentScore

let lastScore = currentScore

// menerima data negara diri sendiri dari server
socket.on('country', country => {
    let savedCountry = localStorage.getItem('country')
    if (savedCountry != country) {
        localStorage.setItem('country', country)
        localStorage.setItem('score', 0)
    }
})

// menerima data scoreboard dari server
socket.on('scoreboard', scoreboard => {
    let index = 1
    let total = 0
    let scoreboardHTML = ""

    // sort dari terkecil
    let keys = Object.keys(scoreboard)
    keys.sort(function(a, b) { return scoreboard[a] - scoreboard[b] })
    keys.reverse()

    // update UI leaderboard (bagian depan)
    let leaderboardRankHTML = `#1 ${keys[0]}`
    let country = localStorage.getItem('country')
    let leaderboardScoreHTML = `${country} ${scoreboard[country]}`
    document.querySelector("#leaderboards-rank").innerHTML = leaderboardRankHTML
    document.querySelector("#leaderboards-score").innerHTML = leaderboardScoreHTML

    // update UI leaderboard (bagian daftar)
    for (const i in keys) {
        const country = keys[i]
        if (country != "NO_GEOLOCATION") {
            total += scoreboard[country]
            let template = `<li class="list-group-item d-flex">
            <div>#${index}</div>
            <div class="ms-3">${country}</div>
            <div class="ms-auto me-0">${scoreboard[country]}</div>
            </div>`
            scoreboardHTML += template
            index += 1
        }
    }
    let template = `<li class="list-group-item d-flex">
            <div class="font-weight-bold">Total</div>
            <div class="ms-auto me-0 font-weight-bold">${total}</div>
            </div>`
    scoreboardHTML = template + scoreboardHTML
    document.querySelector("#leaderboards-list").innerHTML = scoreboardHTML
})

// socket on banned
socket.on('banned', time => {
    alert(`YOU HAVE BEEN BANNED FOR ${time} SECONDS FOR CHEATING`)
})

// kirim data skor ke server 
function sendData() {
    let country = localStorage.getItem('country')
    currentScore = (currentScore == null) ? 0 : localStorage.getItem('score')

    if (country == null || currentScore == null) return
    let total = currentScore - lastScore
    lastScore = currentScore
    socket.emit('update', {
        country: country,
        score: total
    })
}


setInterval(sendData, 1000) // kirim data tiap detik