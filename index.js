import { Console, error } from "console";
import express from "express";
import fs, { read } from "fs"
import bodyParser from "body-parser"

const app = express()
app.use(bodyParser.json())

const readData = () =>{
    try{
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data)
    }   catch{
        error
        console.log(error)
    }
}

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data))
    } catch (error){
        console.log(error)
    }
}


app.get("/", (req, res) => {
    res.send("server 3000")
})

app.get("/books", (req, res) =>{
    const data = readData()
    res.json(data.books)
})

app.get("/books/:id", (req, res) =>{
    const data = readData()
    const id = parseInt(req.params.id);
    const book = data.books.find((book) => book.id === id)
    res.json(book)
})

app.post("/books", (req, res) =>{
    const data = readData()

    const body = req.body;

    const newBook = {
        id: data.books.length + 1,
        ...body,
    }

    data.books.push(newBook)
    writeData(data)

    res.json(newBook)
})

app.put("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const body = req.body;

    const bookIndex = data.books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({ message: "server 3000 " });
    }

    data.books[bookIndex] = {
        ...data.books[bookIndex],
        ...body
    };

    writeData(data);

    res.json(data.books[bookIndex]);
});


app.delete("/books/:id", (req, res) => {
    const data = readData()
    const id = parseInt(req.params.id)
    const bookIndex = data.books.findIndex((book) => book.id === id)
    data.books.splice(bookIndex, 1)
    writeData(data)
    res.json({message: "server 3000"})
})
app.listen(3000, () => {
    console.log("server 3000")
})