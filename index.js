//branch main
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


//Hello World!를 로컬 서버에 보내는 앱. 간단한 연습용 예제.
app.get('/', (req, res) => { res.send('Hello World!, 안녕하세요, 기모리')})


//이 앱은 회원가입할 때 필요한 정보들을 client에서 가져오면
//그것들을 데이터 베이스에 넣어준다.
app.post('/register', (req, res) => {
  
  const user = new User(req.body)
  
  
  //save를 하기전에 암호화처리를 해줘야함

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err}) //실패했을때
    return res.status(200).json({success: true}) //성공했을때
  })
})


app.listen(port, () => {console.log(`Example app listening at http://localhost:${port}`)})



