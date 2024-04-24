var selectedTemplateSrc;

function loadTemplate(src) {
    // Assign the source of the selected template to the global variable
    selectedTemplateSrc = src;
    const img = new Image();
    img.onload = function () {
        let scale = Math.min(500 / img.width, 500 / img.height);
        let width = img.width * scale;
        let height = img.height * scale;
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height);
        generateMeme(); // Call generateMeme after the image is drawn
    };
    img.src = src;
}

const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
let dragging = false;
let textX1 = 50,
    textY1 = 50;
let textX2 = 50,
    textY2 = 100;

function startDrag(e) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (x >= textX1 && x <= textX1 + ctx.measureText(document.getElementById('textInput1').value).width && y >= textY1 - parseInt(document.getElementById('fontSizeInput').value) && y <= textY1) {
        dragging = true;
        currentText = 'text1';
    } else if (x >= textX2 && x <= textX2 + ctx.measureText(document.getElementById('textInput2').value).width && y >= textY2 - parseInt(document.getElementById('fontSizeInput').value) && y <= textY2) {
        dragging = true;
        currentText = 'text2';
    }
}

function dragText(e) {
    if (dragging) {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        if (currentText === 'text1') {
            textX1 = Math.min(Math.max(x, 0), canvas.width - ctx.measureText(document.getElementById('textInput1').value).width);
            textY1 = Math.min(Math.max(y, parseInt(document.getElementById('fontSizeInput').value)), canvas.height);
        } else if (currentText === 'text2') {
            textX2 = Math.min(Math.max(x, 0), canvas.width - ctx.measureText(document.getElementById('textInput2').value).width);
            textY2 = Math.min(Math.max(y, parseInt(document.getElementById('fontSizeInput').value)), canvas.height);
        }
        generateMeme();
    }
}

function stopDrag() {
    dragging = false;
}

function generateMeme() {
    const img = new Image();
    img.onload = function () {
        let scale = Math.min(500 / img.width, 500 / img.height);
        let width = img.width * scale;
        let height = img.height * scale;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        ctx.font = document.getElementById('fontSizeInput').value + 'px ' + document.getElementById('fontInput').value;
        ctx.fillStyle = document.getElementById('colorInput').value;
        ctx.fillText(document.getElementById('textInput1').value, textX1, textY1);
        ctx.fillText(document.getElementById('textInput2').value, textX2, textY2);
    };
    img.src = document.getElementById('imageInput').files.length > 0 ? URL.createObjectURL(document.getElementById('imageInput').files[0]) : selectedTemplateSrc;
}


function saveMeme() {
    var link = document.createElement('a');
    link.download = 'meme.png';
    link.href = document.getElementById('memeCanvas').toDataURL();
    link.click();
}
