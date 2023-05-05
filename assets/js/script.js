let myModal;
let modalDetails = "";

let array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let shuffledArray = array.sort((a, b) => 0.5 - Math.random());

var game_level = "expert";

var gameOnGoing = false;

function initGame() {
    clearImageDivs();
    var lastPerfectScoree = localStorage.getItem("last_perfect_scoree");
    document.getElementById("lastPerfectScoree").innerHTML = lastPerfectScoree;
}

function touchMove(e, image) {
    var touchLocation = e.targetTouches[0];

    // assign box new coordinates based on the touch.
    image.style.left = touchLocation.pageX + 'px';
    image.style.top = touchLocation.pageY + 'px';
}

function touchEnd(e, image) {
    // current box position.
    var x = parseInt(image.x);
    var y = parseInt(image.y);

    var endTarget = document.elementFromPoint(x, y);
    if (endTarget.id.startsWith("expert_image")) {
        swapParent(e.target, endTarget);
    }
}

function attachEventListeners() {
    var images = document.querySelectorAll(".img_container>img");
    for (let image of images) {
        image.draggable = true;

        image.addEventListener('touchstart', {}, {passive: true});
        image.addEventListener('touchmove', function (e) {
            var touchLocation = e.targetTouches[0];

            // assign box new coordinates based on the touch.
            image.style.left = touchLocation.pageX + 'px';
            image.style.top = touchLocation.pageY + 'px';
        }, {passive: true});

        image.addEventListener('touchend', function (e) {
            var x = parseInt(image.style.left);
            var y = parseInt(image.style.top);
            var endTarget = document.elementFromPoint(x, y);
            if (endTarget.id.startsWith("expert_image") && gameOnGoing) {
                swapParent(e.target, endTarget);
            }
        }, {passive: true});
    }

    var helpMeButton = document.getElementById("helpMeButton");
    helpMeButton.addEventListener("click", helpMe, {once: true});

}

function removeEventListeners() {
    var images = document.querySelectorAll(".img_container>img");
    for (let image of images) {
        image.draggable = false;
        image.removeEventListener('touchstart', {}, {passive: true});
        image.removeEventListener('touchmove', function (e) {
            var touchLocation = e.targetTouches[0];

            // assign box new coordinates based on the touch.
            image.style.left = touchLocation.pageX + 'px';
            image.style.top = touchLocation.pageY + 'px';
        }, {passive: true});

        image.removeEventListener('touchend', function (e) {
            var x = parseInt(image.style.left);
            var y = parseInt(image.style.top);
            var endTarget = document.elementFromPoint(x, y);
            if (endTarget.id.startsWith("expert_image")) {
                swapParent(e.target, endTarget);
            }
        }, {passive: true});
    }

    var helpMeButton = document.getElementById("helpMeButton");
    helpMeButton.removeEventListener("click", helpMe, {once: true});

    var startButton = document.getElementById("startGameButton");
    startButton.addEventListener("click", startGame);
}

document.addEventListener('DOMContentLoaded', function () {

    initGame();

    var startButton = document.getElementById("startGameButton");
    startButton.addEventListener("click", startGame);

    myModal = document.getElementById('myModal')
    myModal.addEventListener('show.bs.modal', function (event) {
        var title = modalDetails[0];
        var modalMessage = modalDetails[1];
        var buttonAction = modalDetails[2];

        var modalTitle = myModal.querySelector('.modal-title');
        var modalBodyInput = myModal.querySelector('.modal-body');
        var modalCloseButton = myModal.querySelector('#modalCloseButton');

        modalTitle.textContent = title;
        modalBodyInput.textContent = modalMessage;
    })

    let firstLand = sessionStorage.getItem("first_land");
    if (firstLand != "N") {
        firstLand = "N";
        sessionStorage.setItem("first_land", firstLand);
        showInfo();
    }

});

function startGame() {

    modalDetails = ["New Game", "Remember the images and their position!!!"];
    showModalInfo();

    shuffledArray = array.sort((a, b) => 0.5 - Math.random());

    for (let i = 0; i < shuffledArray.length; i++) {
        let image_div = document.getElementById("div_expert_image" + (i + 1));
        let imgElem = document.getElementById(game_level + "_image" + (i + 1));
        imgElem.src = "assets/images/image" + shuffledArray[i] + ".webp";
        image_div.appendChild(imgElem);
    }

    var startButton = document.getElementById("startGameButton");
    startButton.removeEventListener("click", startGame);

    var countTimer = 15;
    var hasStarted = false;
    var newTimer = 23;

    var gametimer = setInterval(function () {
        // Update the count down every 1 second
        if (countTimer >= 0) {
            document.getElementById("timer").innerHTML = countTimer;
        }

        if (countTimer <= 0 && countTimer > -2) {
            shuffleImageDivs();
        }
        if (countTimer == -2) {
            gameOnGoing = true;
            modalDetails = ["Ready", "Time is running out!  Start rearranging the images!!!"];
            showModalInfo();
            hasStarted = true;
            attachEventListeners();
        }
        if (hasStarted) {
            if (newTimer < 21) {
                document.getElementById("timer").innerHTML = newTimer;
            }
            newTimer--;
        }
        if (newTimer < 0) {
            gameOnGoing = false;
            clearInterval(gametimer);
            removeEventListeners();
            checkOk();
        }
        countTimer--;
    }, 1000);
}

function shuffleImageDivs() {
    let reshuffleArray = array.sort((a, b) => 0.5 - Math.random());
    for (let i = 0; i < array.length; i++) {
        let image_div = document.getElementById("div_" + game_level + "_image" + (i + 1));
        image_div.appendChild(document.getElementById("div_" + game_level + "_image" + (reshuffleArray[i])).firstElementChild);
    }
}

function clearImageDivs() {
    for (let i = 0; i < array.length; i++) {
        let imgElem = document.getElementById(game_level + "_image" + (i + 1));
        imgElem.src = "assets/images/mushroom.webp";
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.setData("parent", ev.target.parentElement.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    swapParent(document.getElementById(data), ev.target);
}

function swapParent(swap1, swap2) {
    var source = swap1.parentElement;
    var target = swap2.parentElement;
    if (!(swap1.src.indexOf("ok_image") > 0 || swap2.src.indexOf("ok_image") > 0)) {
        target.appendChild(swap1);
        source.appendChild(swap2);
    }
}

function helpMe() {
    const parentElement = document.querySelector("#" + game_level + "_level");
    var images = parentElement.querySelectorAll("img");

    let helpCounter = 0;
    for (let image of images) {
        if (image.parentElement.id.endsWith(image.id) && helpCounter < 3) {
            image.src = image.src.replace("images/image", "images/ok_image");
            helpCounter++;
        }
    }
}

function checkOk() {
    var correctAnswer = 0;
    var check = true;

    const parentElement = document.querySelector("#" + game_level + "_level");
    var images = parentElement.querySelectorAll("img");

    for (let image of images) {
        if (!(image.parentElement.id.endsWith(image.id))) {
            check = false;
        } else {
            correctAnswer++;
            image.src = image.src.replace("images/image", "images/ok_image");
        }
    }

    if (check) {
        let high_score = new bootstrap.Modal(document.getElementById('highscoremodal'));
        high_score.show();
    } else {
        modalDetails = ["Well Done!!!", "Your score is " + correctAnswer];
        showModalInfo();
    }
    return correctAnswer;
}

function showModalInfo() {
    var modal1 = new bootstrap.Modal(document.getElementById('myModal'), {});
    modal1.show();
}

function setLastPerfectScore() {
    var initials = document.getElementById("initials").value;
    if (initials != null) {
        localStorage.setItem("last_perfect_scoree", initials);
        document.getElementById("lastPerfectScoree").innerHTML = initials;
        let high_score = bootstrap.Modal(document.getElementById('highscoremodal'));
        high_score.hide();
        return false;
    } else {
        return false;
    }
}

function showInfo() {
    modalDetails =
        ["How to play",
            "To play, wait for timer to finish.  " +
            "Drag images to their original position.  " +
            "Score will be based on total number of images in their original position!  " +
            "Press 'Help Me' to mark maximum 3 images that already in correct position(single use only)."];
    infoModal = new bootstrap.Modal(document.getElementById('myModal'), {});
    infoModal.show();
}
