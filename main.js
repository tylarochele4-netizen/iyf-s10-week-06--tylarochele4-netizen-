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
            name: "Shan", 
            email: "shan@example.com" 
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
                const user = { id: userId, name: "Shan" };
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


// --- Task 11.3: 

// 1. Function to get User
function getUserData(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id: userId, name: "Shan" });
        }, 1000);
    });
}

// 2. Function to get Posts based on User ID
function getUserPosts(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 101, title: "Hello World" },
                { id: 102, title: "Async is cool" }
            ]);
        }, 1000);
    });
}

// 3. Function to get Comments based on Post ID
function getPostComments(postId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, text: "Great post!" },
                { id: 2, text: "Thanks for sharing" }
            ]);
        }, 1000);
    });
}

// --- The Chain ---
getUserData(1)
    .then(user => {
        console.log("User:", user);
        return getUserPosts(user.id); // Return the next promise
    })
    .then(posts => {
        console.log("Posts:", posts);
        return getPostComments(posts[0].id); // Return the next promise
    })
    .then(comments => {
        console.log("Comments on first post:", comments);
    })
    .catch(error => {
        console.error("Something went wrong in the chain:", error);
    });


// --- Task 11.4: 

async function fetchFullUserData(userId) {
    try {
        console.log("Starting async fetch...");

        // 'await' tells JavaScript: "Wait here until this promise resolves"
        const user = await getUserData(userId);
        console.log("Step 1 - User found:", user);

        const posts = await getUserPosts(user.id);
        console.log("Step 2 - Posts found:", posts);

        const comments = await getPostComments(posts[0].id);
        console.log("Step 3 - Comments found:", comments);

        return comments; // This returns a promise containing the comments

    } catch (error) {
        // If ANY of the awaits above fail, it jumps straight here
        console.error("An error occurred during the async process:", error);
    } finally {
        console.log("Async fetch process completed.");
    }
}

// Running the async function
fetchFullUserData(1).then(data => {
    console.log("Final Result in Main Flow:", data);
});


// --- Task 11.4: Parallel Execution (Fast) ---

async function getMultipleUsers() {
    console.log("Starting parallel fetch for 3 users...");
    const startTime = Date.now();

    try {
        // Promise.all starts all 3 functions AT THE SAME TIME
        const [user1, user2, user3] = await Promise.all([
            getUserData(1),
            getUserData(2),
            getUserData(3)
        ]);

        const endTime = Date.now();
        console.log("Users received:", user1, user2, user3);
        console.log(`Total time taken: ${(endTime - startTime) / 1000} seconds`);
        
        // Note: This should take ~1 second total, not 3!
        
    } catch (error) {
        console.error("One of the fetches failed:", error);
    }
}

// Run the parallel test
getMultipleUsers();


// --- Task 12.1: Fetch API Basics 

async function getRealUser(id) {
    try {
        // 1. Start the request
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        
        // 2. Check if the response is "OK" (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // 3. Convert the raw response into a JSON object
        const data = await response.json();
        
        console.log("Real Data Received:", data);
        return data;

    } catch (error) {
        console.error("Failed to fetch real user:", error);
    }
}

// Testing it out
getRealUser(1);


// --- Task 12.1: Fetching All Users 

async function getAllUsers() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        
        if (!response.ok) {
            throw new Error("Failed to fetch users list");
        }
        
        const users = await response.json(); // This is now an Array []
        
        console.log(`Total users found: ${users.length}`);
        
        // Loop through the array and log each user's name
        users.forEach(user => {
            console.log(`User: ${user.name} (Email: ${user.email})`);
        });

        return users;

    } catch (error) {
        console.error("Error fetching all users:", error.message);
    }
}

// Running the function
getAllUsers();


// --- Task 12.2: Display API Data in DOM 

const userList = document.getElementById("user-list");
const loadingIndicator = document.getElementById("loading");

async function displayUsers() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        
        if (!response.ok) throw new Error("Failed to fetch users");

        const users = await response.json();

        // 1. Hide the loading message
        loadingIndicator.style.display = "none";

        // 2. Loop through users and create HTML for each
        users.forEach(user => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${user.name}</strong> 
                <br> 📧 ${user.email} 
                <br> 🏢 ${user.company.name}
                <hr>
            `;
            userList.appendChild(li);
        });

    } catch (error) {
        loadingIndicator.style.display = "none";
        const errorDiv = document.getElementById("error");
        errorDiv.textContent = error.message;
        errorDiv.style.display = "block";
    }
}

// Run the display function
displayUsers();
