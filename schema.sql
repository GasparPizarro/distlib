pragma foreign_keys = on;

CREATE TABLE user (
	username varchar(30) primary key,
	first_name varchar(30),
	last_name varchar(30),
	email varchar(320),
	password text
);

CREATE TABLE book (
	id integer primary key,
	owner varchar(30),
	title text,
	author text,
	year integer,
	foreign key (owner) references user(username)
);

CREATE TABLE user_token (
	username varchar(30) references user(username),
	token varchar(30),
	primary key(username, token)
);

CREATE TABLE loan (
	id integer primary key,
	book integer,
	recipient varchar(30),
	start date,
	span integer,
	status integer, -- 0: waiting, 1: rejected, 2: accepted, 3: finished
	foreign key(recipient) references user(username),
	foreign key(book) references book(id)
);

insert into user (username, first_name, last_name, email, password) values ("user1", "user", "one", "user1@yopmail.com", "$2b$12$eOvhl/Fo1VmU16Jt.lDqVuOvhywRZTkrt1ZoPvmDPRv6W2xDlb.F2");
insert into user (username, first_name, last_name, email, password) values ("user2", "user", "two", "user2@yopmail.com", "$2b$12$eOvhl/Fo1VmU16Jt.lDqVuOvhywRZTkrt1ZoPvmDPRv6W2xDlb.F2");



insert into book (owner, title, author, year) values ("user1", "Animal Farm", "George Orwell", 1945);
insert into book (owner, title, author, year) values ("user1", "A Clockwork Orange", "Anthony Burgess", 1962);
insert into book (owner, title, author, year) values ("user2", "The Plague", "Albert Camus", 1947);
insert into book (owner, title, author, year) values ("user2", "All Quiet on the Western Front", "Erich Maria Remarque", 1929);
insert into book (owner, title, author, year) values ("user1", "A Wizard of Earthsea", "Ursula K. Le Guin", 1968);
insert into book (owner, title, author, year) values ("user1", "Blade Runner 3: Replicant Night", "K. W. Jeter", 1996);
insert into book (owner, title, author, year) values ("user2", "Blade Runner 2: The Edge of Human", "K. W. Jeter", 1995);
insert into book (owner, title, author, year) values ("user2", "Crash", "J. G. Ballard", 1973);
insert into book (owner, title, author, year) values ("user1", "Children of Dune", "Frank Herbert", 1976);
insert into book (owner, title, author, year) values ("user2", "Candide, ou l'Optimisme", "Voltaire", 1759);
insert into book (owner, title, author, year) values ("user1", "Chapterhouse Dune", "Frank Herbert", 1985);
insert into book (owner, title, author, year) values ("user1", "Carmilla", "Sheridan Le Fanu", 1872);
