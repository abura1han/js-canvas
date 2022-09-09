// Get the canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Get demo shape element
const shapeDemo = document.getElementById('shape-demo');

// Tools element
const toolsElement = document.querySelectorAll("#tools > div");

// Default position
let x = 0, y = 0;

// Will true when mouse clicked
let isDrawing = false;

// global value for canvas
let lineWidth = [4];
let fontSize = [20];
let fontWidth = ["normal"];
let fontFamily = ["Segoe UI"]
let canvasText = [];
let canvasColor = "black";
let shapeType = ["fill"];
let canvasWidth = [600];
let canvasHeight = [500];


// canvas size
canvasSize();

function canvasSize() {
    canvas.width = window.innerWidth - 500;
    canvas.height = window.innerHeight - 200;
}

function canvasGlobal() {
    // canvas art settings
    ctx.fillStyle = canvasColor;
    ctx.lineWidth = lineWidth[0];
    ctx.strokeStyle = canvasColor;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.font = `${fontWidth[0]} ${fontSize[0]}px ${fontFamily[0]}`;
}
canvasGlobal();


// Will true when click on any shape [rectengle, triangle, circle]
isShape = false;
let firstPosX = 0, firstPosY = 0;



// If mouse clicked on a tool
let toolaction = null;
let rectval;

// When mousedown event occurred
canvas.addEventListener("mousedown", e => {
    x = e.offsetX; // First clicked X position
    y = e.offsetY; // First clicked Y position
    firstPosX = x, firstPosY = y;
    isDrawing = true;
    isShape = true;

    canvasGlobal();

    if (toolaction === "text") {
        text(ctx, canvasText, firstPosX, firstPosY);
    }

    if (toolaction === "drawline")
        drawline(ctx, x, y, e.offsetX, e.offsetY);
});



// When mousemove event occurred
canvas.addEventListener("mousemove", e => {
    if (isDrawing) {
        // drawline(ctx, x, y, e.offsetX, e.offsetY);

        if (isShape) // If try to draw a shape
            // shape(firstPosX, firstPosY, e.offsetX, e.offsetY);

            if (toolaction === "drawline")
                drawline(ctx, x, y, e.offsetX, e.offsetY);

        if (toolaction === "rectengle" || toolaction === "circle" || toolaction === "triangle" || toolaction === "selecttoerase")
            rectval = shape(firstPosX, firstPosY, e.offsetX, e.offsetY);

        if (toolaction === "text")
            text(ctx, canvasText, x, y);

        if (toolaction === "erase")
            erase(ctx, x, y);

        x = e.offsetX;
        y = e.offsetY;
    }
});



// When mouseout event occurred
canvas.addEventListener("mouseup", e => {
    if (isDrawing) {
        if (toolaction === "drawline")
            drawline(ctx, x, y, e.offsetX, e.offsetY);

        if (toolaction === "rectengle")
            rectengle(ctx, rectval[0], rectval[1], rectval[2], rectval[3])


        if (toolaction === "circle")
            circle(ctx, firstPosX + (rectval[2] / 2), firstPosY + (rectval[3] / 2), rectval[2]);

        if (toolaction === "triangle")
            triangle(ctx, firstPosX, firstPosY, rectval[2], rectval[3]);

        if (toolaction === "text")
            text(ctx, "", x, y);

        if (toolaction === "selecttoerase")
            selectToErase(ctx, firstPosX, firstPosY, rectval[2], rectval[3]);

        setTimeout(() => {
            shapeDemo.style.display = "none";
        }, 1000);

        x = 0, y = 0, firstPosX = 0, firstPosY = 0;
        isDrawing = false;
        isShape = false;

    }
});



// Active tools
activetools(toolsElement);

function activetools(element) {
    for (let i = 0; i < element.length - 1; i++) {
        element[i].addEventListener("click", () => {
            // check id for the action
            if (element[i].id === "drawline") toolaction = "drawline";
            if (element[i].id === "rectengle") toolaction = "rectengle";
            if (element[i].id === "triangle") toolaction = "triangle";
            if (element[i].id === "circle") toolaction = "circle";
            if (element[i].id === "text") toolaction = "text";
            if (element[i].id === "erase") toolaction = "erase";
            if (element[i].id === "selecttoerase") toolaction = "selecttoerase";
            if (element[i].id === "clearcanvas") {
                selectToErase(ctx, 0, 0, canvas.width, canvas.height);
            }


            // Remove existing setting
            clearOptions();


            // Specific setting options for specific tools
            // Canvas art type example fill or stroke
            if (element[i].id === "rectengle" || element[i].id === "triangle" || element[i].id === "circle" || element[i].id === "text") {
                let typeName = (element[i].id === "text" ? "Text Type" : "Shape Type")
                addOption("art-type", `<i class="bi bi-gear"></i> ${typeName}:`);
                addField("art-type", `<span>Type: <select id="shape-type"><option>${shapeType[0]}</option><option value="fill">Fill</option><option value="stroke">Stroke</option></select></span>`);
                readField("shape-type", shapeType);
            }

            // All shape
            if (element[i].id === "rectengle" || element[i].id === "triangle" || element[i].id === "circle" || element[i].id === "drawline" || element[i].id === "erase") {
                addOption("line", `<i class="bi bi-gear"></i> Line Width:`);
                addField("line", `<span>Line Width: <input type="range" id="line-width" min="2" max="40" value="${lineWidth[0]}"></span>`);
                readField("line-width", lineWidth);
            }
            // Text
            if (element[i].id === "text") {
                // Text field
                addOption("text", `<i class="bi bi-file-earmark-font"></i> Text:`);
                addField("text", `<span>Text: <textarea id="text-value">${canvasText[0]}</textarea></span>`);
                // Fonts option
                addOption("font", `<i class="bi bi-textarea-t"></i> Font:`);
                addField("font", `<span>Font Family:<select id="font-family"><option>${fontFamily[0]}</option><option value="Segoe UI">Segoe UI</option><option value="Arial">Arial</option><option value="Cambria">Cambria</option><option value="Consolas">Consolas</option><option value="Lucida Console">Lucida Console</option><option value="Montserrat">Montserrat</option><option value="Verdana">Verdana</option></select></span> <span>Font Size: <input id="font-size" value="${fontSize[0]}" type="number"></span>`)
                addField("font", `<span>Font Width: <select id="font-width"><option>${fontWidth[0]}</option><option value="normal">Normal</option><option value="lighter">Lighter</option><option value="bold">Bold</option><option value="bolder">Bolder</option></select></span>`)

                readField("text-value", canvasText);
                readField("font-family", fontFamily)
                readField("font-width", fontWidth)
                readField("font-size", fontSize);
            }

            // set and remove the active class
            element[i].classList.add('active');
            for (let j = 0; j < element.length; j++) {
                if (i !== j) {
                    element[j].classList.remove('active');
                }
            }
        })
    }
}



// Functions for handling all event action
// Drawline tool
function drawline(context, x, y, x1, y1) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();
}


// Highlight options panel
document.getElementById("settings").addEventListener("click", () => {
    document.getElementById("pop-up").className = "highlight";

    setTimeout(() => {
        document.getElementById("pop-up").classList.remove("highlight");
    }, 2000)
})

// Rectengle tool
function rectengle(context, x, y, width, height) {
    context.beginPath();
    context.rect(x, y, width, height);
    (shapeType[0] === "fill" ? context.fill() : context.stroke());
    context.closePath();
}



// Circle tool
function circle(context, x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius / 2, 0, 2 * Math.PI);
    (shapeType[0] === "fill" ? context.fill() : context.stroke());
    context.closePath();
}



// Triangle tool
function triangle(context, x, y, width, height) {
    let middle = x + (width / 2);
    let x1 = x + width;
    let y1 = y + height;

    context.beginPath();
    context.moveTo(middle, y);
    context.lineTo(x, y1);
    context.lineTo(x1, y1);
    context.lineTo(middle, y);
    (shapeType[0] === "fill" ? context.fill() : context.stroke());
    context.closePath();
}



// Text tool
function text(context, text, x, y) {
    // change the cursor
    if (shapeType[0] === "fill") {
        context.fillText(text, x - fontSize[0], y + (fontSize[0] / 2));
    } else {
        context.lineWidth = 1;
        context.strokeText(text, x, y);
    }
}



// Function for change color
changecolor(document.getElementById("color"));

function changecolor(element) {
    let colorPattle = document.getElementById("color-pattle");

    element.addEventListener("click", () => {
        colorPattle.click();
        colorPattle.addEventListener("input", () => {
            canvasColor = document.getElementById("color-pattle").value;
            canvasGlobal();
            element.style.color = canvasColor;
        })
    })
}


// When try to draw a shape
function shape(x, y, x1, y1) {
    shapeDemo.style.display = "block";
    shapeDemo.style.width = `${x1 - x}px`;
    shapeDemo.style.height = `${y1 - y}px`;
    shapeDemo.style.top = `${y + 10}px`;
    shapeDemo.style.left = `${x + 73}px`;
    shapeDemo.style.zIndex = -1;

    return [x, y, x1 - x, y1 - y];
}

// When try to move the shape
moveShape();

function moveShape() {
    let moveShape = false;

    shapeDemo.addEventListener("mousedown", () => {
        moveShape = true;
    })

    document.addEventListener("mousemove", e => {
        if (moveShape)
            if (e.target.id === "shape-demo") {
                shapeDemo.style.top = `${e.clientY - 250}px`;
                shapeDemo.style.left = `${e.clientX - 250}px`;
                console.log(e.clientX - 250);
            }
    })

    document.addEventListener("mouseup", () => {
        moveShape = false;
    })
}


// Rease tool
function erase(context, x, y) {
    context.beginPath();
    context.clearRect(x, y, lineWidth, lineWidth);
    context.closePath();
}


// Select to erase
function selectToErase(context, x, y, width, height) {
    context.beginPath();
    context.clearRect(x, y, width, height);
    context.closePath();
}



// Settings
// Add a setting
registeredSettings = [];
function addOption(id, title) {
    // Register all settings

    let body = document.querySelector("#pop-up #body");
    let option = document.createElement('div');
    let optTitle = document.createElement("div");
    let optContent = document.createElement("div");

    optTitle.className = "opt-title";
    optContent.className = "opt-content";
    option.className = "option";
    option.id = `setting-option-${id}`;
    optTitle.innerHTML = title;

    option.append(optTitle);
    option.append(optContent);
    body.append(option);

    registeredSettings.push(id);
}



// Add field
function addField(parent, field) {
    let optContent = document.createElement("div");
    optContent.innerHTML = field;

    document.querySelector(`#setting-option-${parent} .opt-content`).append(optContent);
}


// Read field data
function readField(id, destination) {
    let fieldData;
    document.getElementById(id).addEventListener("input", e => {
        fieldData = e.target.value;
        destination.shift();
        destination.push(fieldData)
    })
}


// Remove setting
function clearOptions() {
    for (let i = 0; i < registeredSettings.length; i++) {
        document.querySelector(`#pop-up #body #setting-option-${registeredSettings[i]}`).remove();
    }

    registeredSettings = [];
}