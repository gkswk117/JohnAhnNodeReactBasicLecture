const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10;


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


userSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
    //비밀번호를 암호화 시킨다.

        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err,hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    //const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
    //next();
    } else {
        next()
    }
})
const User = mongoose.model('User', userSchema)
module.exports = {User}