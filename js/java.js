function inizializza (){
    var intro = document.getElementById("intro");
    var dati = document.getElementById("dati");
    var about = document.getElementById("about");
    var cont = document.getElementById("container");
    document.addEventListener("scroll", function (){
        var scroll = scrollY;
        if (scroll > 330){
            intro.style.color= "#263238";
            intro.style.fontWeight= "800";
            dati.style.color= "#263238";
            dati.style.fontWeight= "800";
            about.style.color= "#263238";
            about.style.fontWeight= "800";
            cont.style.backgroundImage = "linear-gradient(whitesmoke, rgb(255,255,255,0))";
            
        } else {
            intro.style.color= "white";
            intro.style.fontWeight= "600";
            dati.style.color= "white";
            dati.style.fontWeight= "600";
            about.style.color= "white";
            about.style.fontWeight= "600";
            cont.style.backgroundImage ="none";
        }
    })
}



window.onload = inizializza;