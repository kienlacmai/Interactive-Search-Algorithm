// interactive.js

// Function to check if the user's traversal is correct
let userInput = [];
let correctAnswer = [];

function checkDFSTraversal(userInput, correctAnswer) {
    if (userInput.join('') === correctAnswer.join('')) {
        alert('✅ Correct DFS Traversal!');
    } else {
        alert('❌ Try Again!');
    }
}

// Highlight user click
function highlightNode(nodeId, correct) {
    cy.getElementById(nodeId).animate({
        style: {
            'background-color': correct ? '#28a745' : '#dc3545' // green or red
        }
    }, { duration: 300 });
}

// Start interactive DFS session
function startInteractiveDFS() {
    resetGraph(); // optional: reset graph before starting

    userInput = [];
    correctAnswer = dfs(sampleGraph, 'A'); // Get correct order from your DFS
    console.log("Correct DFS Order:", correctAnswer);

    // Enable user interaction
    cy.nodes().on('tap', function(evt) {
        const clickedId = evt.target.id();

        // Ignore if already clicked
        if (userInput.includes(clickedId)) return;

        const nextCorrect = correctAnswer[userInput.length];

        if (clickedId === nextCorrect) {
            userInput.push(clickedId);
            highlightNode(clickedId, true);

            // If complete, check final result
            if (userInput.length === correctAnswer.length) {
                checkDFSTraversal(userInput, correctAnswer);
            }
        } else {
            highlightNode(clickedId, false);
            alert('Incorrect node! That’s not the next DFS step.');
        }
    });
}


// Animate the DFS traversal by highlighting nodes
function animateDFSTraversal(order) {
    const delay = 600;

    order.forEach((nodeId, index) => {
        setTimeout(() => {
            cy.getElementById(nodeId).animate({
                style: { 'background-color': 'orange' }
            }, { duration: 300 });
        }, index * delay);
    });
}

// Run DFS and visualize the result
function startDFS() {
    const traversalOrder = dfs(sampleGraph, 'A');
    animateDFSTraversal(traversalOrder);
}

// Hook into DOMContentLoaded to optionally auto-run DFS for testing
document.addEventListener("DOMContentLoaded", () => {
    // Uncomment to auto-run DFS on page load
    // startDFS();
});

// Reset the graph to its original state
function resetGraph() {
    cy.nodes().forEach(node => {
        node.animate({
            style: {
                'background-color': '#007BFF',
                'color': '#fff',
                'text-outline-color': '#007BFF'
            }
        }, { duration: 300 });
    });
}
