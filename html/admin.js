

document.getElementById('getUsers').addEventListener("click", () => {
    fetch("/api")
        .then(response => response.json())
        .then(users => {
            output = ''
            Object.keys(users).forEach(username => {
                const role = users[username].role;
                output += `<p>${username} - ${role}</p>`;
            });
            document.getElementById('showUsers').innerHTML = output;
        })
        .catch(error => console.error("Error fetching notes:", error));
});
