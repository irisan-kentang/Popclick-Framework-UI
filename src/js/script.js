import {Howl, Howler} from 'howler'

import pop1_img from '../images/pop_1.png'
import pop2_img from '../images/pop_2.png'
import pop_audio from '../audios/pop.ogg'

// load score
let savedScore = localStorage.getItem("score")
if (savedScore == null) {
    localStorage.setItem("score", 0)
}

let holded = false
let sound = new Howl({
    src: [pop_audio]
});

// init
document.querySelector("#popimg").src = pop1_img
document.querySelector("#popimg").setAttribute('draggable', false)
document.querySelector("#score").innerHTML = parseInt(localStorage.getItem("score"))

function actionHold() {
    if (!holded) {
        sound.play()
        document.querySelector("#popimg").src = pop2_img

        // update score dan update UI tiap klik
        let score = parseInt(localStorage.getItem("score")) + 1
        localStorage.setItem("score", score)
        document.querySelector("#score").innerHTML = score

        holded = true
    }
}

function actionRelease() {
    document.querySelector("#popimg").src = pop1_img
    holded = false
}

window.addEventListener('mousedown', actionHold)
window.addEventListener('mouseup', actionRelease)

window.addEventListener('keydown', actionHold)
window.addEventListener('keyup', actionRelease)