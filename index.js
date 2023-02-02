const express = require('express')
const cors = require('cors')
const app = express()

const PORT = process.env.PORT || 3001;

/* Data */
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

/* Utility Helpers */
const generatedId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

const requestLogger = (request, response, next) => {
  console.log('Method', request.method);
  console.log('Path', request.path);
  console.log('Body', request.body);
  console.log('-----');
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

/* Middleware */
app.use(express.json())
app.use(requestLogger)
app.use(cors())


/* Routes */
app.get('/', (request, response) => {
    response.send(`<h1>The Notes API</h1>`)
    response.end()
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
    response.end()
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)

    if(note) {
        response.json(note);
    } else {
        response.status(404).end()
    }
    
})
app.post('/api/notes', (request, response) => {
  const body = request.body

  if(!body.content) {
    return response.status(400).json({error: 'content missing'})
  }

  const note = {
    content: body.content,
    important: body.important || false,  
    date: new Date(),
    id: generatedId()
  }

  notes = notes.concat(note)

  response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

/* This Middleware is only called if NO routes are available
* to handle requests
*/
//app.use(unknownEndpoint)

/* Server */
app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT} with PID: ${process.pid}`)
})

