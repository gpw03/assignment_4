#!/usr/bin/env node

const http = require('http')
const fs = require('node:fs');
const { createHmac, randomUUID } = require('node:crypto');

const notes = []
const key = "1234"
const secret = 'abcdefg';
let idGenerator = 0
const hash = (str) =>
  createHmac('sha256', secret).update(str).digest('hex');

let users
fs.readFile('passwd.db', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  users = JSON.parse(data)
  console.log(data);
});

let role
const authenticate = (auth = '') => {
  const [ user, pass ] = atob(auth.slice(6)).split(':');
  role = users[user]?.role;
  console.log(user)
  console.log(pass)
  console.log("Hash: ", hash(pass + user))
  return !!user && !!pass && users[user]?.password === hash(pass + user);
};


const handleRequest = (req, res) => {
  const [path, query] = req.url.split('?')
  console.log("Getting here");
  console.log(req.method);
  console.log(role);
  const auth = authenticate(req.headers.authorization);
  
  if([ 'POST', 'PUT', 'DELETE' ].includes(req.method)) {
  // On POST
    console.log(auth);
    console.log("Role: ", role);

    if (role === "admin") {
      console.log("302 triggered");
      res.writeHead(302);
      res.end(JSON.stringify({ isAdmin: true })); 
      return;
    }
    if(!auth){
      res.writeHead(401, {
        "WWW-Authenticate": "Basic realm='not authorized'"
      });
      res.end();
    }  else  if (req.method === "POST") {
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
      res.end("What are you looking for?");
    }
  } else if (role === "admin" && req.method === "GET"){
    console.log("In the right spot");
    console.log(users);
    res.writeHead(200);
    res.end(JSON.stringify(users));
  } else {
    res.writeHead(200);
    res.end(JSON.stringify(notes));
  }
}
const server = http.createServer(handleRequest);
server.listen(3000);
