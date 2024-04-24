/*var selectedTemplateSrc;

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
}   */

function loadTemplate(src) {
    window.location.href = 'customize.html?template=' + encodeURIComponent(src);
}