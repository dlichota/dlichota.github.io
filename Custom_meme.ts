// Assuming these elements exist in your HTML
declare const canvas: HTMLCanvasElement;
declare const ctx: CanvasRenderingContext2D;

// Global variables
let selectedTemplateSrc: string;
let dragging: boolean = false;
let textX1: number = 50,
    textY1: number = 50;
let textX2: number = 50,
    textY2: number = 100;
let currentText: 'text1' | 'text2';

function loadTemplate(src: string): void {
    selectedTemplateSrc = src;
    const img = new Image();
    img.onload = function() {
        const scale: number = Math.min(500 / img.width, 500 / img.height);
        const width: number = img.width * scale;
        const height: number = img.height * scale;
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height);
        generateMeme(); // Call generateMeme after the image is drawn
    };
    img.src = src;
}

function loadUserImage(): void {
    const file = (document.getElementById('userImageInput') as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e: ProgressEvent<FileReader>) {
            loadTemplate(e.target?.result as string);
            generateMeme();
        };
        reader.readAsDataURL(file);
    }
}

// Load the selected template when the page is loaded
const urlParams = new URLSearchParams(window.location.search);
selectedTemplateSrc = decodeURIComponent(urlParams.get('template') || '');
loadTemplate(selectedTemplateSrc);

function startDrag(e: MouseEvent): void {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x >= textX1 && x <= textX1 + ctx.measureText((document.getElementById('textInput1') as HTMLInputElement).value).width && y >= textY1 - parseInt((document.getElementById('fontSizeInput') as HTMLInputElement).value) && y <= textY1) {
        dragging = true;
        currentText = 'text1';
    } else if (x >= textX2 && x <= textX2 + ctx.measureText((document.getElementById('textInput2') as HTMLInputElement).value).width && y >= textY2 - parseInt((document.getElementById('fontSizeInput') as HTMLInputElement).value) && y <= textY2) {
        dragging = true;
        currentText = 'text2';
    }
}

function dragText(e: MouseEvent): void {
    if (dragging) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (currentText === 'text1') {
            textX1 = Math.min(Math.max(x, 0), canvas.width - ctx.measureText((document.getElementById('textInput1') as HTMLInputElement).value).width);
            textY1 = Math.min(Math.max(y, parseInt((document.getElementById('fontSizeInput') as HTMLInputElement).value)), canvas.height);
        } else if (currentText === 'text2') {
            textX2 = Math.min(Math.max(x, 0), canvas.width - ctx.measureText((document.getElementById('textInput2') as HTMLInputElement).value).width);
            textY2 = Math.min(Math.max(y, parseInt((document.getElementById('fontSizeInput') as HTMLInputElement).value)), canvas.height);
        }
        generateMeme();
    }
}

function stopDrag(): void {
    dragging = false;
}

function generateMeme(): void {
    const img = new Image();
    img.onload = function() {
        const scale: number = Math.min(500 / img.width, 500 / img.height);
        const width: number = img.width * scale;
        const height: number = img.height * scale;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        drawText(); // Call drawText after the image is drawn
    };
    img.src = (document.getElementById('userImageInput') as HTMLInputElement).files?.length > 0 ? URL.createObjectURL((document.getElementById('userImageInput') as HTMLInputElement).files[0]) : selectedTemplateSrc;
}

function drawText(): void {
    const font: string = (document.getElementById('fontSizeInput') as HTMLInputElement).value + 'px ' + (document.getElementById('fontInput') as HTMLInputElement).value;
    document.fonts.load(font).then(function() {
        ctx.font = font;
        ctx.fillStyle = (document.getElementById('colorInput') as HTMLInputElement).value;
        ctx.fillText((document.getElementById('textInput1') as HTMLInputElement).value, textX1, textY1);
        ctx.fillText((document.getElementById('textInput2') as HTMLInputElement).value, textX2, textY2);
    });
}

function saveMeme(): void {
    canvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = URL.createObjectURL(blob!);
        link.click();
    });
}
