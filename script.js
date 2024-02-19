class Timer {
    constructor() {
        this.date = new Date();
    }
    setStartTime() {
        this.date = new Date();
    }
    getDifference(currentDate) {
        const h = currentDate.getHours()-this.date.getHours();
        const m = currentDate.getMinutes()-this.date.getMinutes();
        const s = currentDate.getSeconds()-this.date.getSeconds();
        return h*3600+m*60+s;
    }
}
const timer = new Timer();

function game1Start() {
    document.getElementById("score").style.display = "none";
    timer.setStartTime();
    document.getElementById("game1").style.display = "block";
    document.getElementById("game1Init").style.display = "none";
}

function game1() {
    const guess = document.getElementById("game1Guess").value;
    const score = guess-timer.getDifference(new Date());
    score = 2;
    if (score > 0) {
        document.getElementById("score").innerHTML = "You were "+score+" seconds over";
    }
    else if (score < 0) {
        score*=-1;
        document.getElementById("score").innerHTML = "You were "+score+" seconds under";
    }
    else {
        document.getElementById("score").innerHTML = "You were right on the money";
    }
    
    document.getElementById("game1").style.display = "none";
}

function reset() {
    document.getElementById("score").style.display = "none";

    document.getElementById("game1Init").style.display = "none";
    document.getElementById("game1").style.display = "none";

    document.getElementById("game2Init").style.display = "none";
    document.getElementById("game2").style.display = "none";

    document.getElementById("game3Init").style.display = "none";
    document.getElementById("game3").style.display = "none";
}

