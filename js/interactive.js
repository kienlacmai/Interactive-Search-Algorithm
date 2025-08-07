// Example conceptual quiz
function checkDFSTraversal(userInput, correctAnswer) {
    if (userInput.join('') === correctAnswer.join('')) {
        alert('Correct!');
    } else {
        alert('Try Again!');
    }
}

// Example usage:
const correctTraversal = dfs(sampleGraph, 'A');
// Later, you’d compare this with user input from UI elements