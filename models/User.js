const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
   name:{
       type: String,
       maxlengh: 50
   },
   email: {
       type: String,
       trim: true, //trim은 예를 들면 gkswk 117@gmail.com 에서 spacebar 없애주는 역할
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
   role: {//관리자, 일반유저 등등 구분하는 정보. 0이면 일반유저, 1이면 관리자
       type: Number,
       defualt: 0 //임의로 정해주지 않으면 자동으로 0번
   },
   
   image: String,


   token: { // 나중에 유효성 같은거를 관리할 수도 있음.
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

userSchema.methods.comparePassword = function(plainPassword, ch){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return ch(err),
        cb(null, isMatch)
    })
}
userSchema.methods.generateToken=function(cb){
    var user =this;
    //jsonwebtoken을 이용해서 토큰을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}
userSchema.statics.findByToken = function(token, ch){
    var user=this;
    //user._id+''=token
    //토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id":decoded, "token":token}, function (err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}
const User = mongoose.model('User', userSchema)
module.exports = {User}