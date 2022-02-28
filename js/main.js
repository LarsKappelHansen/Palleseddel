// JavaScript source code
function onresize() {
    refresh();
}

var lastSignatureWidth = 0;

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
    var signatureWidth = viewWidth - viewPaddings - elementLeftMargin;
    if (signatureWidth != lastSignatureWidth) {
        setsignatureWidth(signatureWidth);
        lastSignatureWidth = signatureWidth;
    }
    SetSendButtonPosition(viewWidth - viewPaddings);

}

function setWidth(className, width) {
    const elements = document.getElementsByClassName(className);
    for (element of elements) {
        element.style.width = width + 'px';
    }
}

function setsignatureWidth(width) {
    signature.width = 2 * width;
    signature.style = 'width: ' + width + 'px; height: 200px';
}

function SetSendButtonPosition(width) {
    var divSend = document.getElementById("divSend");
    divSend.style.width = width + 'px';
}

// create canvas element and append it to document body
var signature = document.getElementById("signature");

// get canvas 2D context and set him correct size
var signatureContext = signature.getContext('2d');

const signatureState = {
    mousedown: false
};

// last known position
var signaturePos = { x: 0, y: 0 };


signature.addEventListener('mousedown', handleWritingStart);
signature.addEventListener('mousemove', handleWritingInProgress);
signature.addEventListener('mouseup', handleDrawingEnd);
signature.addEventListener('mouseout', handleDrawingEnd);

signature.addEventListener('touchstart', handleWritingStart);
signature.addEventListener('touchmove', handleWritingInProgress);
signature.addEventListener('touchend', handleDrawingEnd);

function handleWritingStart(e) {
    if (!signatureFullyVisible()) {
        return;
    }

    e.preventDefault();

    document.activeElement.blur();

    setPosition(e);

    signatureContext.beginPath(); // begin

    signatureContext.moveTo(signaturePos.x, signaturePos.y);

    signatureContext.lineWidth = 3;
    signatureContext.lineCap = 'round';
    signatureContext.strokeStyle = 'black';

    signatureState.mousedown = true;
}

function signatureFullyVisible() {
    return (window.scrollY + window.innerHeight) >= (signature.offsetTop + signature.offsetHeight);
    //console.log("window.scrollY " + window.scrollY);
    //console.log("window.innerHeight " + window.innerHeight);
    //console.log("signature.offsetHeight " + signature.offsetHeight);
    //console.log("window.scrollY + window.innerHeight " + (window.scrollY + window.innerHeight));
    //console.log("signature.offsetTop  + signature.offsetHeight " + );
}

function handleWritingInProgress(e) {
    e.preventDefault();

    if (signatureState.mousedown) {
        setPosition(e);
        signatureContext.lineTo(signaturePos.x, signaturePos.y); // to

        signatureContext.stroke(); // draw it!
    }
}

function handleDrawingEnd(e) {
    e.preventDefault();

    signatureState.mousedown = false;


}

// new position from mouse event
function setPosition(e) {

    var rect = signature.getBoundingClientRect(), // abs. size of element
        scaleX = signature.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = signature.height / rect.height;  // relationship bitmap vs. element for Y

    var clientX = e.clientX || e.touches[0].clientX;
    var clientY = e.clientY || e.touches[0].clientY;

    signaturePos.x = (clientX - rect.left) * scaleX;
    signaturePos.y = (clientY - rect.top) * scaleY;
}

function clearSignature() {
    signatureContext.clearRect(0, 0, signature.width, signature.height);
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
        underskrift: signature.toDataURL()
        //datotid: Date.now()
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
    clearSignature()
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
    clearSignature();
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


