
document.getElementById('noteForm').addEventListener("submit", (ev) => {
    ev.preventDefault();

    console.log("In")
    const userKey = document.getElementById('key').value;
    const title = document.getElementById('title').value;
    const note = document.getElementById('note').value;

    fetch ('/api', {
        method: "POST",
        body: JSON.stringify({ userKey, title, note}),
        redirect: 'follow',
    })
    .then(response => {
        console.log(response);
        if (response.status === 302) {
            response.json().then(data => {
                if (data.isAdmin) {
                    window.location.href = "/admin.html";  // Redirect to the admin page
                }
            }); // Redirect to admin page
        } else {
            return response.json();  // Parse JSON response
        }
    })
    .then(data => console.log(data.message))
    .catch(error => console.error("Note did not save: ", error));
    document.getElementById('noteForm').reset();
});

document.getElementById('getNotes').addEventListener("click", () => {
    fetch("/api")
        .then(response => response.json())
        .then(notes => {
            let output = ''
            notes.forEach(note => {
                output += `<p><b>ID#:${note.id} ${note.title}:</b> ${note.note}</p>`;
            });
            document.getElementById('printedNotes').innerHTML = output;
        })
        .catch(error => console.error("Error fetching notes:", error));
});

// Clear Printed notes section on button press
document.getElementById('hideNotes').addEventListener("click", () => {
    document.getElementById('printedNotes').innerHTML = '';
});

document.getElementById('deleteNote').addEventListener("submit", (e) => {
    // Stop the form from doing regular form things
    e.preventDefault();
    const deleteID = document.getElementById('deleteID').value;

    fetch ('/api', {
        method: "DELETE",
        body: JSON.stringify({ deleteID }),
    })
    .then(data => console.log(data.message));

    document.getElementById('printedNotes').innerHTML = `<P>Click Show Notes to Refresh with updated notes</p>`;
    document.getElementById('deleteNote').reset();
});

document.getElementById('updateNote').addEventListener("submit", (e) => {
    // Stop form from doing regular things
    e.preventDefault();
    const noteID = document.getElementById('noteID').value;
    const newTitle = document.getElementById('newTitle').value;
    const newNote = document.getElementById('newNote').value;

    fetch('/api', {
        method: "PUT",
        body: JSON.stringify({ noteID, newTitle, newNote }),
    })
    .then(data => console.log(data.message));

    document.getElementById('printedNotes').innerHTML = `<P>Click Show Notes to Refresh with updated notes</p>`;
    document.getElementById('updateNote').reset();
});


