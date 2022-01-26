// hacer peticion a la siguiente url: https://api.dictionaryapi.dev/api/v2/entries/en/<word>
async function getWord(word) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    return data;
}
let defined = false;

// Obtener elementos del DOM con id desc
var word = document.getElementById('word');
// Obtener elementos del DOM con id desc
var definitionContainer = document.getElementById('defsContainer');

chrome.tabs.executeScript(null, {
    code: "window.getSelection().toString();"
}, function(selection) {
    // si hay algo seleccionado
    if (selection && selection[0] && !defined) {
        getWord(selection[0]).then(data => {
            console.log(data);
            if (data.length > 0) {
                setView(data[0]);
                defined = true;
            } else {
                word.innerText = "No se encontró definición";
            }
        });
    }
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function setView(data) {
    // data.word to uppercase
    word.innerText = capitalizeFirstLetter(data.word);
    // word.innerText = data.word;

    data.meanings.forEach((meaning, i) => {
        var p = document.createElement('p');

        p.innerText = `Definicion ${i+1}: ` + meaning.definitions[0].definition;
        p.innerText += (meaning.definitions[0].example) ? "\n\nEjemplo: " + meaning.definitions[0].example : '';

        definitionContainer.appendChild(p);

        if (data.meanings.length > 1 && i < data.meanings.length - 1) {
            let hr = document.createElement('hr');
            hr.className = 'solid';
            definitionContainer.appendChild(hr);
        }
    });
}