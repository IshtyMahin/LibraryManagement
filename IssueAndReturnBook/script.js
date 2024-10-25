document.getElementById('issue-button').addEventListener('click', async () => {
    const userId = document.getElementById('issue-user-id').value;
    const bookIds = document.getElementById('issue-book-ids').value.split(',').map(id => id.trim());

    const response = await fetch(`https://librarymanagementsystem-rmstu.vercel.app/api/admin/bookIssue/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookList: bookIds })
    });

    const messageDiv = document.getElementById('issue-message');
    messageDiv.innerText=""
    if (response.ok) {
        const result = await response.json(); 

        if (result.issued && result.issued.length > 0) {
            messageDiv.textContent += 'Books issued successfully: ' + result.issued.join(', ')+".";
        } 

            if (result.notFound && result.notFound.length > 0) {
                messageDiv.textContent += `\n\nBooks not found: ${result.notFound.join(', ')}.`;
            }
    
            if (result.notAvailable && result.notAvailable.length > 0) {
                messageDiv.textContent += `\n\nBooks not available: ${result.notAvailable.join(', ')}.`;
            }
    
            if (result.alreadyIssued && result.alreadyIssued.length > 0) {
                messageDiv.textContent += `\n\nBooks already issued: ${result.alreadyIssued.join(', ')}.`;
            }
           
        
            event.preventDefault();
        
        

    } else {
        const error = await response.json();
        messageDiv.textContent = error.message || 'An error occurred while issuing books.';
        event.preventDefault();
    }
});

document.getElementById('return-button').addEventListener('click', async () => {
    const userId = document.getElementById('return-user-id').value;
    const bookIds = document.getElementById('return-book-ids').value.split(',').map(id => id.trim());

    const response = await fetch(`https://librarymanagementsystem-rmstu.vercel.app/api/admin/bookReturn/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookList: bookIds })
    });

    const messageDiv = document.getElementById('return-message');
      messageDiv.innerText=""
    if (response.ok) {
        const result = await response.json(); 
        if (result.returned && result.returned.length > 0) {
            messageDiv.textContent += 'Books returned successfully: ' + result.returned.join(', ')+".";
        }

    
        if (result.notFound && result.notFound.length > 0) {
            messageDiv.textContent += `\nBooks not found: ${result.notFound.join(', ')}.`;
        }

        if (result.notPossessed && result.notPossessed.length > 0) {
            messageDiv.textContent += `\nBooks not in possession: ${result.notPossessed.join(', ')}.`;
        }
        event.preventDefault();
    } else {
        const error = await response.json();
        messageDiv.textContent = error.message || 'An error occurred while returning books.';
        event.preventDefault();
    }
});

