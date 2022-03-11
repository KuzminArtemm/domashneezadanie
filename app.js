const { reverse } = require('dns')
const express = require('express')

const path = require('path')

const { db } = require('./DB')

const server = express()

const PORT = 3011

server.set('view engine', 'hbs')

server.set('views', path.join(__dirname, 'src', 'views'))

server.use(express.urlencoded({ extended: true }))

server.use(express.static(path.join(process.cwd(), 'public')))

server.get('/', (req, res) => {
  const blogQuery = req.query
  let peopleForRender = db.blog
  if (blogQuery.reverse) {
    peopleForRender.reverse()
  }
  if (blogQuery.limit !== undefined && Number.isNaN(+blogQuery.limit) === false) {
    peopleForRender = db.blog.slice(0, blogQuery.limit)
  }

  res.render('main', { cardOfBlog: peopleForRender })
})

server.post('/postList', (req, res) => {
  const dataFromForm = req.body
  db.blog.push(dataFromForm)
  res.redirect('/')
})

server.use('/info', (req, res) => {
  let someName = req.query.name
  let someTitle = req.query.title
  let someContent = req.query.content
  res.send(
    `<h1>Info</h1>
    <p>name=${someName}</p>
    <p>title=${someTitle}</p>
    <p>content=${someContent}</p>`)
})

server.get('*', (req, res) => {
  res.render('404')
})

server.listen(PORT, () => {
  console.log(`Server has been started on port: ${PORT}`)
})
