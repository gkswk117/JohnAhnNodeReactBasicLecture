//branch [master] "소스트리에서 변경되는지 확인."
//참고: https://www.inflearn.com/
//따라하며 배우는 노드, 리액트 시리즈 - 기본 강의
//nodejs 설치 -> express 받기 -> MongoDB 계정만들고 설치 -> mongoose 받기 ->
//git(로컬) 설치 -> github(온라인) 계정만들기 -> git(로컬)과 github(온라인)를 연결시켜주는 ssh key 생성 -> NODE MON 설치

//node.js가 설치되었는지 확인: node -v
//git이 설치되었는지 확인: git --version
//어플리케이션 가동: npm run start 또는 npm run backend
//git의 staging area에 있는 정보 삭제: git rm --cached node_modules(니가 지우고 싶은것) -r
//git 상태 확인: git status
//nodemon: package.json에 있음. backend말고 다른 이름 붙여줘도 됨. nodemon덕분에 코드 수정시 서버를 내렸다가 다시 키지 않아도 바로바로 웹페이지에 적용됨.

const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const {User}=require("./models/User")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {auth}=require('./middleware/auth')
const config = require('./config/key')

//MongoDB와 연결해주는 녀석
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

//application/json
app.use(bodyParser.json())

app.use(cookieParser())

//Hello World!를 로컬 서버에 보내는 앱. 간단한 연습용 예제.
app.get('/', (req, res) => { res.send('Hello World!, 안녕하세요.')})

app.post('/api/users/register', (req, res) => {
  //이 앱은 회원가입할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body)

  //save를 하기전에 암호화처리를 해줘야함
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err}) //실패했을때
    return res.status(200).json({success: true}) //성공했을때
  })
})

app.post('/api/users/login', (req, res)=>{
  //요청된 이메일을 데이터베이스에 있는지 찾는다.
  User.findOne({email:req.body.email}, (err, user)=>{
      if(!user){
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다."
        })
      }
      //User.js에 'comparePassword' method 정의
      user.comparePassword(req.body.password, (err,isMatch)=>{
        if(!isMatch)
        return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})
        user.generateToken((err, user)=>{
          if(err) return res.status(400).send(err);
          //토큰을 저장한다. 어디에? 쿠키에 할까? 로컬스토리지에 할까? 지금은 쿠키에다가 한다.
          res.cookie("x_auth", user.token)
          .status(200)
          .json({loginSuccess:true, userId: user._id})
        })
      })
  })
  //요청된 이메일이 데이터베이스에 있다면 비밀번호가 일치하는지 확인.
  //비밀번호까지 맞다면 토큰을 생성하기.
})


app.get('/api/users/auth', auth, (req, res) =>{
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
  //role 0 -> 일반 유저, role이 0이 아니면 관리자
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email
  })

})


app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
          success: true
      });
  });
});

app.listen(port, () => {console.log(`Example app listening at http://localhost:${port}`)})



