import express from 'express';
import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import multer from 'multer';
import cors from 'cors';
import bcrypt from 'bcrypt';
import {createServer} from 'http';
import randomstring from 'randomstring';

const app = express();
var upload = multer();
app.use(cors({exposedHeaders: '*'}));

const PORT = 5000;

var http = createServer(app);

http.listen(8080, "127.0.0.1");

const server = app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});

app.use(async (req, res, next) => {
    req.db = await open({
        filename: './data.db',
        driver: sqlite3.Database
    });
    next();
});

app.use(async (req, res, next) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.substring("Token ".length);
        let row = await req.db.get("select username from user_token where token = ?", [token]);
            if (row)
            req.username = row.username;
    }
    next();
})

var books = express.Router();

books.get('/', async (req, res) => {
    let page = (req.query.page || 1) - 1;
    let size = req.query.size || 10;
    let rows = await req.db.all("select id, title, author, year from book where owner = ? order by title collate nocase limit ? offset ?", [req.username, size, page * size]);
    res.set("page-count", Math.floor((await req.db.get("select count(*) from book where owner = ?", [req.username]))["count(*)"] / size));
    res.status(200).json(rows);
});

books.post("/",  upload.none(), async (req, res) => {
    let title = req.body.title;
    let author = req.body.author;
    let year = req.body.year;
    let result = await req.db.run("insert into book (owner, title, author, year) values (?, ?, ?, ?)", [req.username, title, author, year]);
    res.status(200).json({
        "id": result.lastID,
        "title": title,
        "owner": req.username,
        "author": author,
        "year": year
    })
});

books.delete("/:bookId", upload.none(), async (req, res) => {
    let token = req.headers.authorization.substring("Token ".length);
    let row = await req.db.get("select recipient from loan where book = ? and status = 2", [req.params.bookId]);
    if (row)
        res.status(403).send('Cannot delete lent book');
    else {
        let user = await req.db.get("select username from user_token where token = ?", [token]);
        await req.db.run("delete from book where owner = ? and id = ?", [user.username, req.params.bookId]);
        res.status(204).send();
    }

});

books.put("/:bookId", upload.none(), async (req, res) => {
    let updatableFields = ["title", "author", "year"];
    let fieldQueries = [];
    for (let field of updatableFields)
        if (field in req.body)
            fieldQueries.push(field + " = ?");
    let query = "update book set " + fieldQueries.join(", ") + " where id = ? and owner = ?";
    let fieldValues = [];
    for (let field of updatableFields)
        if (field in req.body)
            fieldValues.push(req.body[field]);
    fieldValues.push(req.params.bookId);
    fieldValues.push(req.username);
    await req.db.run(query, fieldValues);
    res.status(200).send();
});

books.get("/search", async (req, res) => {
    let query = req.query.q;
    let page = req.query.page;
    let size = req.query.size;
    let includeMine = req.query.mine == "true";
    let bookCount;
    let books;
    if (includeMine) {
        bookCount = (await req.db.get("select count(*) from book where title like ? or author like ?", ["%" + query + "%", "%" + query + "%"]))["count(*)"];
        books = await req.db.all("select id, owner, title, author, year from book where (title like ? or author like ?) limit ? offset ?", ["%" + query + "%", "%" + query + "%", size, (page - 1) * size]);
    }
    else {
        bookCount = (await req.db.get("select count(*) from book where title like ? or author like ? and owner != ?", ["%" + query + "%", "%" + query + "%", req.username]))["count(*)"];
        books = await req.db.all("select id, owner, title, author, year from book where (title like ? or author like ?) and owner != ? limit ? offset ?", ["%" + query + "%", "%" + query + "%", req.username, size, (page - 1) * size]);
    }
    let result = [];
    for (let book of books) {
        let subResult = {
            id: book.id,
            owner: book.owner,
            title: book.title,
            author: book.author,
            year: book.year,
        };

        if (await (req.db.get("select recipient from loan where book = ? and status = 2", [book.id]))) {
            let recipient =  (await req.db.get("select recipient from loan where book = ? and status = 2", [book.id]))["recipient"];
            subResult.bearer = recipient;
        }
        result.push(subResult);
    }
    res.set("page-count", bookCount / size);
    res.status(200).json(result);
});

app.post("/token", upload.none(), async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let row = await req.db.get("select password from user where username = ?", [username]);
    let hashedPassword = row.password;
    let result = await bcrypt.compare(password, hashedPassword);
    if (result) {
        let row = await req.db.get("select token from user_token where username = ?", [username]);
        if (row)
            res.status(200).json({token: row.token});
        else {
            let token = randomstring.generate({length: 40});
            await req.db.run("insert into user_token (username, token) values (?, ?)", [username, token]);
            res.status(200).json({token: token});
        }
    }
    else
        res.status(401).json({"error": "Bad credentials"});
});

var profile = express.Router();

profile.get('/', async (req, res) => {
    let profile = await req.db.get("select username, first_name, last_name from user where username = ?", [req.username]);
    res.status(200).json({
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name
    });
});

profile.post("/", upload.none(), async (req, res) => {
    let firstName = req.body["first_name"];
    let lastName = req.body["last_name"];
    let oldPassword = req.body["old_password"];
    let newPassword = req.body["new_password"];

    if (newPassword) {
        let oldHash = (await req.db.get("select password from user where username = ?", [req.username]))["password"];
        console.log(oldHash);
        if (await bcrypt.compare(oldPassword, oldHash))
            req.body["password"] = await bcrypt.hash(newPassword, 10);
        else {
            res.status(400).json({"error": "Wrong password"});
            return;
        }
    }

    let updatableFields = ["first_name", "last_name", "password"];
    let fieldQueries = [];
    for (let field of updatableFields)
        if (field in req.body)
            fieldQueries.push(field + " = ?");

    let query = "update user set " + fieldQueries.join(", ") + " where username = ?";
    let fieldValues = [];
    for (let field of updatableFields)
        if (field in req.body)
            fieldValues.push(req.body[field]);

    fieldValues.push(req.username);

    await req.db.run(query, fieldValues);

    if (req.body["password"])
        await req.db.run("delete from user_token where username = ?", [req.username]);
    res.status(200).send();
});

var loans = express.Router();

loans.get("/", async (req, res) => {
    let loans = await req.db.all("select id, book, recipient, start, span, status from loan " +
        "where book in (select id from book where owner = ?) and status in (0, 2)", [req.username]);
    for (let loan of loans)
        loan.book = await req.db.get("select id, owner, title, author, year from book where id = ?", [loan.book]);
    return res.status(200).json(loans);
});

loans.post("/", upload.none(), async (req, res) => {
    let bookId = req.body["book_id"];
    let recipient = req.body["recipient"];
    let timeRange = req.body["time_range"];
    let start = new Date();
    let result = await req.db.run(
        "insert into loan (book, recipient, start, span, status) values (?, ?, ?, ?, ?)",
        [bookId, recipient, start, timeRange, 0]);
    res.status(200).json({
        "id": result.lastID,
        "book": bookId,
        "recipient": recipient,
        "start": null,
        "span": timeRange,
        "status": 0
    });
});

loans.patch("/:loanId", upload.none(), async (req, res) => {
    let status = req.body["status"];
    let newStatus = {
        "accepted": 2,
        "rejected": 1,
        "finished": 3
    };

    if (status == "accepted") {
        let owner = (await req.db.get("select owner from book where id = (select book from loan where id = ?)", [req.params.loanId]))["owner"];
        if (owner != req.username) {
            res.status(400).json({"error": "user does not own book"});
            return;
        };
    }

    await req.db.run("update loan set status = ?, start = ? where id = ?", [newStatus[status], new Date(), req.params.loanId]);

    let loan = await req.db.get("select id, book, recipient, start, span, status from loan where id = ?", [req.params.loanId]);
    loan.book = await req.db.get("select id, owner, title, author, year from book where id = ?", [loan.book]);
    res.status(200).json(loan);
});

var debts = express.Router();

debts.get("/", async (req, res) => {
    let debts = await req.db.all("select id, book, start, span, status from loan where recipient = ? and status = 2", [req.username]);

    for (let debt of debts) {
        debt.book = await req.db.get("select id, owner, title, author, year from book where id = ?", [debt.book]);
        debt.lender = (await req.db.get("select owner from book where id = ?", [debt.book.id]))["owner"];
    }

    res.status(200).json(debts);
});

app.get("/logout", async (req, res) => {
    await req.db.run("delete from user_token where username = ?", [req.username])
	res.status(200).json({"status": "logged_out"});
});


var requireLogin = async function(req, res, next) {
    if (req.username)
        next();
        // setTimeout(() => next(), 5000);
    else
        res.status(401).send();
};

app.use("/books", requireLogin, books);
app.use("/profile", requireLogin, profile);
app.use("/loans", requireLogin, loans);
app.use("/debts", requireLogin, debts);
