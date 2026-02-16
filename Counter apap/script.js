let plus = document.querySelector(".plus");
let reset = document.querySelector(".reset");
let minus = document.querySelector(".minus");
let score = document.querySelector(".score-container")
plus.addEventListener("click" , function(){
   let x = Number(score.innerHTML);
   x+=1
   score.innerHTML = x;
});
