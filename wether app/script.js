let input = document.getElementById("input");
let btn = document.getElementById("btn");
btn.addEventListener("click", function() {
    let xx = input.value;
    console.log(xx);
    input.value = "";
});