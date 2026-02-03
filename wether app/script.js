const input = document.getElementById("input");
const button = document.getElementById("btn");
button.addEventListener("click",async function(){
const location = input.value;
if(location!=""){
    const data = await fetchWeather(location);
    if(data==null){
    }
    else{
        updateDOM(data);
    }
}

})

async function fetchWeather(location) {
  const url = `https://api.weatherapi.com/v1/current.json?key=c7236d36debb4636a18170654262201&q=${location}&aqi=no`;
  const response = await fetch(url);

  if (response.status === 400) {
    return null;
  } else {
    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData;
  }
}
function updateDOM(data){
    //filter the data
    const temp = data.current.temp_c;
    const location = data.location.name;
    const timeData = data.location.localtime;
    const [date, time] = timeData.split(" ");
    const iconLink = data.current.condition.icon;
    console.log(temp,location,timeData,date,time,iconLink);


    //update it 
    let timee =document.getElementsByClassName("time1");
    timee[0].textContent = time;
    let loc = document.querySelector(".location");
    loc.textContent = location;
    
    let datee = document.getElementsByClassName("date");
    datee[0].innerHTML = date;
    let deg = document.getElementById("deg");
    deg.innerHTML = temp+" celsius";
    let image = document.querySelector("img");
    image.src = iconLink;



}

