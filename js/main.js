// JavaScript source code
function onresize() {
    refresh();
}

var lastCanvasWidth = 0;

function refresh() {
    //var viewWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    //var viewWidth = window.innerWidth;
    var viewWidth = document.documentElement.clientWidth;
    if (viewWidth > 800) {
        viewWidth = 800;
    }

    var viewPaddings = 60;
    var elementLeftMargin = 0;
    setWidth('section', (viewWidth - viewPaddings));
    setWidth('elementNumberField', (viewWidth - viewPaddings - elementLeftMargin - 14));
    setWidth('elementTextField', (viewWidth - viewPaddings - elementLeftMargin - 14));
    setWidth('dropbtn', (viewWidth - viewPaddings));
    setWidth('dropelement', (viewWidth - viewPaddings - 2));
    var canvasWidth = viewWidth - viewPaddings - elementLeftMargin;
    if (canvasWidth != lastCanvasWidth) {
        setCanvasWidth(canvasWidth);
        lastCanvasWidth = canvasWidth;
    }
    SetSendButtonPosition(viewWidth - viewPaddings);

}

function setWidth(className, width) {
    const elements = document.getElementsByClassName(className);
    for (element of elements) {
        element.style.width = width + 'px';
    }
}

function setCanvasWidth(width) {
    canvas.width = 2 * width;
    canvas.style = 'width: ' + width + 'px; height: 200px';
}

function SetSendButtonPosition(width) {
    var divSend = document.getElementById("divSend");
    divSend.style.width = width + 'px';
}

// create canvas element and append it to document body
var canvas = document.getElementById("canvas");

// get canvas 2D context and set him correct size
var canvasContext = canvas.getContext('2d');

const canvasState = {
    mousedown: false
};

// last known position
var canvasPos = { x: 0, y: 0 };


canvas.addEventListener('mousedown', handleWritingStart);
canvas.addEventListener('mousemove', handleWritingInProgress);
canvas.addEventListener('mouseup', handleDrawingEnd);
canvas.addEventListener('mouseout', handleDrawingEnd);

canvas.addEventListener('touchstart', handleWritingStart);
canvas.addEventListener('touchmove', handleWritingInProgress);
canvas.addEventListener('touchend', handleDrawingEnd);

function handleWritingStart(e) {
    if (!canvasFullyVisible()) {
        return;
    }

    e.preventDefault();

    document.activeElement.blur();

    setPosition(e);

    canvasContext.beginPath(); // begin

    canvasContext.moveTo(canvasPos.x, canvasPos.y);

    canvasContext.lineWidth = 3;
    canvasContext.lineCap = 'round';
    canvasContext.strokeStyle = 'black';

    canvasState.mousedown = true;
}

function canvasFullyVisible() {
    return (window.scrollY + window.innerHeight) >= (canvas.offsetTop + canvas.offsetHeight);
    //console.log("window.scrollY " + window.scrollY);
    //console.log("window.innerHeight " + window.innerHeight);
    //console.log("canvas.offsetHeight " + canvas.offsetHeight);
    //console.log("window.scrollY + window.innerHeight " + (window.scrollY + window.innerHeight));
    //console.log("canvas.offsetTop  + canvas.offsetHeight " + );
}

function handleWritingInProgress(e) {
    e.preventDefault();

    if (canvasState.mousedown) {
        setPosition(e);
        canvasContext.lineTo(canvasPos.x, canvasPos.y); // to

        canvasContext.stroke(); // draw it!
    }
}

function handleDrawingEnd(e) {
    e.preventDefault();

    canvasState.mousedown = false;


}

// new position from mouse event
function setPosition(e) {

    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    var clientX = e.clientX || e.touches[0].clientX;
    var clientY = e.clientY || e.touches[0].clientY;

    canvasPos.x = (clientX - rect.left) * scaleX;
    canvasPos.y = (clientY - rect.top) * scaleY;
}

function clearCanvas() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

function clearPaller() {
    clearPalleField("numEurpalle11");
    clearPalleField("numEurpalle12");
    clearPalleField("numEurpalle14");
}

function clearPalleField(fieldName) {
    var palleField = document.getElementById(fieldName);
    palleField.value = '';
}

function clearAndet() {
    var andetField = document.getElementById("buttonAndet");
    andetField.innerHTML = 'Vælg fra liste...';
}

function clearKommentar() {
    var palleField = document.getElementById("textFieldKommentar");
    palleField.value = '';
}

function onSend() {
    var data = getInput();
    saveData(data);
    //Send...
    //openIDB()
    //    .then(db => {
    //        let request = db.transaction([STORE_NAME], "readonly")
    //            .objectStore(STORE_NAME)
    //            .openCursor();

    //        // success!
    //        request.onsuccess = function (event) {
    //            console.log('request.onsuccess');
    //            //// get a handle to the cursor
    //            //var cursor = event.target.result;
    //            //// do we have a valid cursor?
    //            //if (cursor) {
    //            //    // add the feedback item to the array
    //            //    items.push(cursor.value);
    //            //    // move onto the next item in the object store
    //            //    cursor.continue();
    //            //} else {
    //            //    // no valid cursor, so must be at the end
    //            //    resolve({ db: db, items: items });
    //            //}

    //        };

    //        // ugh, error
    //        request.onerror = function (event) {
    //            console.error(request.error);
    //            reject(request.error);
    //        }
    //    })  // openIDB()
    //    .catch((error) => {
    //        console.error(request.error);
    //        reject(request.error);
    //    }); // openIDB()

    clearForm();
    refresh();
}

function getInput() {
    var data = {
        eurpaller11: document.getElementById("numEurpalle11").value,
        eurpaller12: document.getElementById("numEurpalle12").value,
        eurpaller14: document.getElementById("numEurpalle14").value,
        andet: document.getElementById("buttonAndet").innerHTML,
        kommentar: document.getElementById("textFieldKommentar").value,
        underskrift: ""
        //price: 4.99,
        //description: 'A very tasty sandwich',
        //created: new Date().getTime()
    };
    return data;
}

function clearForm() {
    clearPaller();
    clearAndet();
    clearKommentar();
    clearCanvas()
}

function buttonAndetClick() {
    document.getElementById("andetDropdown").classList.toggle("show");
}

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function onSelectAndet(selection) {
    document.getElementById("andetDropdown").classList.toggle("show");
    var andetField = document.getElementById("buttonAndet");
    andetField.innerHTML = selection;
}

function eraserButtonClick() {
    clearCanvas();
}


//*** PWA stuff

window.addEventListener('beforeinstallprompt', (event) => {
    //event.prompt();
    // wait for the response from the deferred prompt
    console.log('beforeinstallprompt');
    event.userChoice.then((res) => {
        // did the user approve installation?
        if (res.outcome === 'accepted') {
            console.log('doInstall: accepted');
        } else {
            console.log('doInstall: declined');
        }
    });
});

// register an event listener for after the app installs
window.addEventListener('appinstalled', (event) => {
    console.log('App Installed');
});


refresh();


