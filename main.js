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


// --- Task 11.2: 

function getUserData(userId) {
    return new Promise((resolve, reject) => {
        console.log(`Fetching data for user ID: ${userId}...`);

        setTimeout(() => {
            // Logic: If ID is a positive number, it "succeeds"
            if (userId > 0) {
                const user = { id: userId, name: "John Doe" };
                resolve(user); // Success!
            } else {
                reject("Invalid user ID"); // Failure!
            }
        }, 1000);
    });
}

// How to use the Promise:
getUserData(1)
    .then((user) => {
        console.log("Success! User found:", user);
    })
    .catch((error) => {
        console.error("Error:", error);
    });

// Testing the Error case (using ID 0)
getUserData(0)
    .then((user) => console.log(user))
    .catch((error) => console.log("Caught expected error:", error));
