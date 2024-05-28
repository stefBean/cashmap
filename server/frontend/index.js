function helloWorld(){
    const bodyElement = document.querySelector("body");
    var pHello = document.createElement('p');
    pHello.textContent = "Hello World!"
    bodyElement.appendChild(pHello);
}

helloWorld();