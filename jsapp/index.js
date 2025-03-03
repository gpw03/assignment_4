#!/usr/bin/env node

const http = require('http')

const notes = []
const key = "1234"
let idGenerator = 0

const handleRequest = (req, res) => {
  const [path, query] = req.url.split('?')

  // On POST
  if(req.method == "POST") {
    let body = '';
    req.on('data', (data) => {
      body += data
    });
    req.on('end', () => {
      try {
        const { userKey, title, note } = JSON.parse(body);
        console.log(key);
        console.log(userKey);
        
        if (key !== userKey) {
          res.writeHead(403)
          res.end(JSON.stringify({ error: "Invalid Key." }));
          return;
        }

        idGenerator += 1;
        id = idGenerator;
        notes.push({ id, title, note });
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Note Saved!" }));
      } catch {
        res.writeHead(400)
        res.end(JSON.stringify({ error: "How did you find yourself here?" }))
      }
    });
    //On GET
  } else if (req.method == "GET"){
    res.writeHead(200);
    res.end(JSON.stringify(notes));
  } else if (req.method == "DELETE"){
    let body = '';
    req.on('data', (data) => {
      body += data
    });
    req.on('end', () => {
      try {
        const { deleteID } = JSON.parse(body);

        const index = notes.findIndex(note => note.id == deleteID);

        if (index === -1) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "No note with that ID."}));
          return;
        }

        notes.splice(index, 1);
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Note Deleted!"}));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Your input is invalid. "}))

      }
    });

  } else if (req.method == "PUT") {
    let body = '';
    req.on('data', (data) => {
      body += data
    });
    req.on('end', () => {
      try {
        const { noteID, newTitle, newNote } = JSON.parse(body);

        const index = notes.findIndex(note => note.id == noteID);
        console.log(index);

        if (index === -1) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "No note with that ID."}));
          return;
        }
        console.log({ noteID, newTitle, newNote })
        notes[index] = { id: noteID, title: newTitle, note: newNote };
        console.log(notes[index]);
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Note Saved!" }));
      } catch {

      }
    });
  } else {
    res.writeHead(404);
    res.end("What are you looking for?")
  }
}
const server = http.createServer(handleRequest)
server.listen(3000)
