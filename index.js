require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dns = require('dns')
const app = express()

// Object
class Urls {
  constructor(url, number) {
    this.url = url
    this.number = number
  }
}

// Array
let urlsArray = []

// Basic Configuration
const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/public', express.static(`${process.cwd()}/public`))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

// Your first API endpoint
app.get('/api/shorturl/:id', (req, res, next) => {
  const id = Number(req.params.id)

  for(let i = 0; i < urlsArray.length; i++){
    if(id === urlsArray[i].number){
      res.locals.url = urlsArray[i].url
      next()
    }
  }
})

app.get('/api/shorturl/:id', (req, res) => {
  const url = res.locals.url
  res.redirect(url)
})

app.post('/api/shorturl', (req, res, next) => {
  const url = new URL(req.body.url)
  
  dns.lookup(url.hostname, (err, addr, fam) => {
    if(err) {
      res.json({error: 'invalid url'})
    } else {
      next()
    }
  })
})

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url
  const randomNumber = numeroAleatorio(1,100)

  const newUrl = new Urls(url, randomNumber)
  urlsArray.push(newUrl)
  
  res.json({original_url: url, short_url: randomNumber})
})





// My Functions
function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (min - 1 + max) + min)
}

app.listen(port, function() {
  console.log(`Listening on port ${port}`)
});
