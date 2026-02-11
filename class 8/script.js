document.querySelector(".grandparents").addEventListener("click", function() {
    console.log()
    let p = document.createElement("p");
    p.textContent = "Grandparent - bubbling";
    document.querySelector(".event-log").appendChild(p);
    
})
document.querySelector(".parents").addEventListener("click", function(e) {
    console.log()
    let p = document.createElement("p");
    p.textContent = "Parent - bubbling";
    document.querySelector(".event-log").appendChild(p);
    
})