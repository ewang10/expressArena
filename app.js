const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.get('/burgers', (req, res) => {
    res.send('We have juicy cheese burgers!');
});

app.get('/pizza/pepperoni', (req, res) => {
    res.send('Your pizza is on the way!');
});

app.get('/pizza/pineapple', (req, res) => {
    res.send("We don't serve that here. Never call again!");
});

app.get('/echo', (req, res) => {
    const responseText = `Here are some details for your request:
        Base URL = ${req.baseUrl}
        Host = ${req.hostname}
        Path = ${req.path}
    `;
    res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end(); //do not send any data back to the client
});

app.get('/greetings', (req, res) => {
    //1. get values from the request
    const name = req.query.name;
    const race = req.query.race;

    //2. validate the values
    if (!name) {
        //3. name was not provided
        return res.status(400).send('Please provide a name');
    }

    if (!race) {
        //3. race was not provided
        return res.status(400).send('Please provide a race');
    }

    //4. and 5. both name and race are valid so do the processing.
    const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

    //6. send the response 
    res.send(greeting);
});

app.get('/sum', (req, res) => {
    let a = req.query.a;
    let b = req.query.b;
    console.log(typeof a + " " + typeof b);

    if (!a) {
        return res.status(400).send('a is required');
    }

    if (!b) {
        return res.status(400).send('b is required');
    }

    a = parseFloat(a);
    b = parseFloat(b);

    if (Number.isNaN(a)) {
        return res.status(400).send('a must be a number');
    }

    if (Number.isNaN(b)) {
        return res.status(400).send('b must be a number');
    }

    const sum = `The sum of ${a} and ${b} is ${a+b}`;
    res.status(200).send(sum);
});

app.get('/cypher', (req, res) => {
    const text = req.query.text;
    let shift = req.query.shift;

    if (!text) {
        return res.status(400).send('text is required');
    }

    if (!shift) {
        return res.status(400).send('shift is required');
    }

    shift = parseInt(shift);

    if (Number.isNaN(shift)) {
        return res.status(400).send('shift must be a number');
    }
    //console.log(text + " " + shift);
    const base = 'A'.charCodeAt(0);
    let cypher = text.toUpperCase().split('').map(char => {
        const charCode = char.charCodeAt(0);
        if (charCode < base || charCode > (base + 26)) {
            return char;
        }
        console.log(char + " " + charCode);
        let diff = charCode - base;
        diff += shift;
        diff %= 26;
        
        let newChar = String.fromCharCode(base + diff);
        return newChar;
        //console.log(String.fromCharCode(newChar));
        //return String.fromCharCode(newChar);
    });
    cypher = cypher.join('');
    res.status(200).send(cypher);
});

app.get('/lotto', (req, res) => {
    const arr = req.query.arr;
    console.log(arr);

    if(!arr) {
        return res.status(400).send("numbers is required");
    }

    if(!Array.isArray(arr)) {
        return res.status(400).send("numbers must be in an array.");
    }
    if (arr.length != 6) {
        return res.status(400).send('arr must have 6 numbers');
    }
    for (let i = 0; i < arr.length; i++) {
        arr[i] = parseInt(arr[i]);
        if (Number.isNaN(arr[i])) {
            return res.status(400).send('each element in arr must be a number.');
        } else if (arr[i] < 1 || arr[i] > 20) {
            return res.status(400).send('each element in arr must be between 1 and 20.');
        }
    }

    const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);
    const newNums = [];

    for (let i = 0; i < 6; i++) {
        const rnd = Math.floor(Math.random * stockNumbers.length);
        newNums.push(stockNumbers[rnd]);
        stockNumbers.splice(rnd, 1);
    }

    const compare = stockNumbers.filter(num => !arr.includes(num));
    let result;
    if ((6 - compare.length) < 4) {
        result = "Sorry, you lose";
    } else if (compare.length === 2) {
        result = "Congradulations, you win a free ticket";
    } else if (compare.length === 1) {
        result = "Congradulations! You win $100";
    } else if (compare.length === 0) {
        result = "Wow! Unbelievable!";
    }

    res.status(400).send(result);
});

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});