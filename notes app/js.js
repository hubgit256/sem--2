let child = document.querySelector(".child");
let parent = document.querySelector(".Paraent");
let score = document.querySelector(".score");
child.addEventListener("click",function(){
    const maxx = parseInt(parent.style.width)-parseInt(child.style.width);
    const maxy = parseInt(parent.style.height)-parseInt(child.style.height);
    console.log(parent.style.width);
    const randomX = Math.random()*maxx;
    const randomY = Math.random()*maxy;
    child.style.left = randomX + "px";
    child.style.top = randomY + "px";
    score.innerHTML = parseInt(score.innerHTML)+1;
})