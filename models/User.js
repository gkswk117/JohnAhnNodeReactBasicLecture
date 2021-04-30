const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
   name:{
       type: String,
       maxlengh: 50
   },
   email: {
       type: String,
       trim: true, //trim은 gkswk 117@gmail.com 에서 spacebar 없애주는 역할
       unique: 1 //똑같은 이메일은 쓰지 못하게
   },
   password: {
       type: String,
       minlength: 6
   
   },
   lastname: {
        type: String,
        maxlengh: 50
   },
   role: {//관리자, 일반유저 등등 구분하는 정보
       type: Number,
       defualt: 0 //임의로 정해주지 않으면 자동으로 0번
   },
   
   image: String,


   token: { // 나중에 유효성 같은거를 줄 수도 있음.
        type: String

   },
   tokenExp: { //유효기간
        type: Number
   }
})

const User = mongoose.model('User', userSchema)
module.exports = {User}