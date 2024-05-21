const axios = require('axios');
const puppeteer = require('puppeteer');

function generateRandomEmail() {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'example.com', 'test.com'];
    const usernameLength = Math.floor(Math.random() * 10) + 5; // Random username length between 5 and 14 characters
    let username = '';
    
    // Generate a random username
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789._';
    for (let i = 0; i < usernameLength; i++) {
        username += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Choose a random domain
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    return `${username}@${domain}`;
}

// Example usage
// console.log(generateRandomEmail());


// Function to create a user on the website
async function createUser(username,email, password) {
    try {
        console.log('Creating user:', username);
        const response = await axios.post('https://example.com', {
            email: email,
            password: password,
            username: username
        });
        console.log('response message', response);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

// Function to visit the website with the created user
async function visitWebsite(username,email, password) {
    console.log('Visiting website with user:', username , email, password);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(600000);
    
    // Assuming there's a login page at /login
    await page.goto('https://example.com/');

    await page.waitForSelector('button[id=toReg]');
    await page.evaluate(() =>
        document.querySelectorAll('button[id=toReg]')[0].click()
    );

    await page.waitForSelector('button[id=regMember]', { timeout: 60000 });
    await page.evaluate(() =>
        document.querySelectorAll('button[id=regMember]')[0].click()
    );

    // Assuming there are input fields with IDs "username" and "password"
    await page.type('input[placeholder="Enter your email"]', email);
    await page.type('#input', username);
    // await page.type('#password', password);
    await page.click('button[type="submit"]');
    console.log('Clicked submit button');
    // Wait for the page to load after login
    await page.waitForNavigation();
    console.log('Page loaded after login');
    await browser.close();
}

// Usage
(async () => {
    try {
        var promises = [];
        for(var i=0; i<3; i++){
            let m = Math.floor(Math.random() * 1000) + 5;
            const {username, email, password} = {username: 'bot-'+m, email: generateRandomEmail(), password: 'Iknowyoucanseepasswords@451Huh'};
            console.log('User:', username, email, password);
            promises.push(visitWebsite(username,email,password));
            // const user = await createUser(username,email,password);
        }
        try {
            await Promise.all(promises);
            console.log(`All requests completed successfully.`);
        } catch (error) {
            console.error('One or more requests failed:', error);
        }
        // await visitWebsite(username, email, password);
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();
