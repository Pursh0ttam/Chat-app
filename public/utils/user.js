
const users = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error:"username and room is required"
        }
    }

    const existingUser = users.find((user)=>{
        return user.username === username && user.room === room

    })
    if(existingUser){
        return{
            error:"the user is in use"
        }
    }  
    
    const user = {id,username,room}
    users.push(user)
    return {user}

}
//^ find one user
let getUser = (id)=>{
    let findValue = users.find((user)=>user.id===id)
    return findValue
}

//^find all user

let getUserInRoom = (room)=>{
   return users.filter((user)=>user.room === room)
}

let removeUser =(id)=>{
    const index =  users.findIndex((user)=>user.id === id)
    if(index !== -1){
      return users.splice(index,1)[0]
    }
  }


  module.exports={
    addUser,getUser,getUserInRoom,removeUser
  }