function dataLoader() {
    fetch('/readFromDatabase')
        .then(response => response.json())
        .then(data => {
            const result_section = document.getElementById('result-section');
            result_section.innerHTML = '';
            data.forEach(topic => {
                const article = document.createElement('article');
                article.className = 'articles'
                article.innerHTML = `
                    <p class="mb-2 text-capitalize"<strong>Name:</strong> ${topic.name}</p>
                    <p class="mb-2"><strong>Date:</strong> ${topic.date}</p>
                    <p class="mb-2"><strong>Question:</strong> ${topic.question}</p>
                    <p class="mb-2"><strong>ans:</strong> ${topic.ans}</p>
                    <button onclick="editBtn('${topic._id}')" class="btn btn-success px-4">Edit</button>
                    <button onclick="deleteBtn(event,'${topic._id}')" class="btn btn-danger px-4">Delete</button>
                `
                result_section.appendChild(article);
            })
        })
}
dataLoader()

// edit data
function editBtn(id) {
    fetch(`/editSingleTopic/${id}`)
        .then(response => response.json())
        .then(data => {
            const edit_section = document.getElementById('edit-section');
            edit_section.innerHTML = `
                <div class="col-md-6 mb-4">
                    <h4 class="mt-4 mb-3">Edit Information</h4>
                    <strong>Update Id: ${data._id}</strong>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group mb-4">
                            <input type="text" name="name" id="name" value="${data.name}" class="form-control" placeholder="Enter Name">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group mb-4">
                            <input type="date" name="date" id="date" value="${data.date}" min="2021-01-01" class="form-control">
                        </div>
                    </div>
                </div>
                <div class="form-group mb-4">
                    <input type="text" name="question" id="question" value="${data.question}" class="form-control" placeholder="Enter Question">
                </div>
                <div class="form-group mb-4">
                    <textarea name="ans" id="ans" rows="10" class="form-control" placeholder="Answer">${data.ans}</textarea>
                </div>
                <div class="form-group">
                    <button onclick="updateData('${data._id}')" class="btn btn-primary px-4">Update</button>

                    <button onclick="cancelBtn()" class="btn btn-dark px-4">Cancel</button>
                </div>
            `
        })
}

function cancelBtn() {
    if (confirm('press ok to cancel update')) {
        document.getElementById('edit-section').innerHTML = ''
    }
}

// update data to send database
function updateData(id) {
    // select each id of edit element part
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const question = document.getElementById('question').value;
    const ans = document.getElementById('ans').value;
    const updatingValue = { name, date, question, ans };
    fetch(`/updateValue/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatingValue),
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                dataLoader()
                document.getElementById('edit-section').innerHTML = ''
            }
        })
}


// delete item
function deleteBtn(event, id) {
    fetch(`/delete/${id}`, {
        method: 'DELETE',
    })
        .then(res => res.json())
        .then(data => {
            if (data) {
                event.target.parentNode.style.display = "none";
            }
        })
}