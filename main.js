// Exercise 1: Synchronous vs Asynchronous Prediction
console.log("A");

setTimeout(() => {
    console.log("B");
}, 0);

console.log("C");

setTimeout(() => {
    console.log("D");
}, 100);

console.log("E");

// Output Order: A, C, E, B, D


// Exercise 2: Callback Pattern
function loadUser(userId, callback) {
    // Simulate 1.5 second database lookup
    setTimeout(() => {
        const user = { 
            id: userId, 
            name: "John Doe", 
            email: "john@example.com" 
        };
        
        // Call the callback with the user object
        callback(user);
    }, 1500);
}

// Using the loadUser function
loadUser(1, (user) => {
    console.log("User loaded:", user);
});
