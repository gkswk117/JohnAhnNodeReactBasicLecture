//참고: https://www.inflearn.com/
//nodejs 설치, express 받기, MongoDB계정만들고 설치, mongoose 받기, git 설치
//node.js가 설치되었는지 확인: node -v
//git이 설치되었는지 확인: git --version
//git에 있는 모든 정보 삭제: git rm --cached node_modules -r


const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://gkswk117:<password>@firstcluster.o1xr7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



