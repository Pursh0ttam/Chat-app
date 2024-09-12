let socket = io()

//^-------------count program----------------------------------------------
// socket.on("updatedCount", (count) => {
//     console.log("count has been updated", count);

// })
// let btn = document.getElementById("btn")
// btn.addEventListener('click', () => {
//     console.log("clicked");        
//     socket.emit("inc")
// })

//^--------------------------------------welcome program--------------------

let form = document.getElementById('form')
let btn = document.getElementById('btn')
let input = document.getElementById("input")
let message = document.getElementById("message")
let locationmessage = document.getElementById("location-message").innerHTML
// let chatSidebar = document.querySelector(".chat__sidebar").innerHTML
// console.log(chatSidebar);

//^templates
let firstSrc = document.getElementById("firstSrc").innerHTML
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log(username, room);
const sidebartemplate = document.getElementById("sidebar-template").innerHTML

const autoScroll=()=>{
    const newMessage = message.lastElementChild

    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    const visibleHeight = message.offsetHeight;
    const containerHeight = message.scrollHeight;
    const scrollOffset = message.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        message.scrollTop = message.scrollHeight;
    }
}

socket.on("greeting", (greet) => {
    const html = Mustache.render(firstSrc, {
        val:greet.text,
        greet: greet.username,
        createdAt: moment(greet.createdAt).format('h:mm a')
    })
    // console.log(greet.createdAt);
    message.insertAdjacentHTML('beforeend', html)
    setTimeout(autoScroll, 0);
    
})

socket.on("locationMessage", (url) => {
    console.log(url);

    const location = Mustache.render(locationmessage, {
        username:url.username,
        url,
        createdAt: moment(url.createdAt).format('h:mm a')
    })
    message.insertAdjacentHTML('beforeend', location)
    autoScroll()
})

socket.on("roomData",({room,users})=>{
  
//    console.log(users[0].username);
   let html = Mustache.render(sidebartemplate,{
    room:room,users
   })
   document.getElementById("sidebar").innerHTML=html
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    btn.setAttribute('disabled', 'true')
    socket.emit('click', input.value, () => {
        console.log("msg sent successfully");

        btn.removeAttribute('disabled')
        input.value = ""
        input.focus()
    })
    // socket.emit("msgToSender","msg send successfully")
})

let locationBtn = document.getElementById('location')
locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('browser does not support location')
    }
    locationBtn.setAttribute('disabled', 'true')
    navigator.geolocation.getCurrentPosition((postion) => {
        let { latitude, longitude } = postion.coords
        // console.log(latitude,longitude);
        let liveLoaction = { latitude, longitude }
        socket.emit("location", liveLoaction, (msg) => {
            console.log("location shared", msg);
            locationBtn.removeAttribute('disabled')
        })
    })
})


socket.emit("join", { username, room }, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})
// socket.on("chat-room", (val) => {
//     chatSidebar
// })