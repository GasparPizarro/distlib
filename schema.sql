pragma foreign_keys = on;

CREATE TABLE user (
	username varchar(30) primary key,
	first_name varchar(30),
	last_name varchar(30),
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

insert into user (username, first_name, last_name, password) values ("user1", "user", "one", "$2b$12$eOvhl/Fo1VmU16Jt.lDqVuOvhywRZTkrt1ZoPvmDPRv6W2xDlb.F2");
insert into user (username, first_name, last_name, password) values ("user2", "user", "two", "$2b$12$eOvhl/Fo1VmU16Jt.lDqVuOvhywRZTkrt1ZoPvmDPRv6W2xDlb.F2");
insert into user (username, first_name, last_name, password) values ("user3", "user", "three", "$2b$12$eOvhl/Fo1VmU16Jt.lDqVuOvhywRZTkrt1ZoPvmDPRv6W2xDlb.F2");


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
insert into book (owner, title, author, year) values ("user2", "The Cider House Rules", "John Irving", 1985);
insert into book (owner, title, author, year) values ("user2", "Dracula", "Bram Stoker", 1897);
insert into book (owner, title, author, year) values ("user2", "Don Quixote", "Miguel de Cervantes", 1605);
insert into book (owner, title, author, year) values ("user2", "Dune Messiah", "Frank Herbert", 1969);
insert into book (owner, title, author, year) values ("user1", "Darwin's Dangerous Idea", "Daniel Dennett", 1995);
insert into book (owner, title, author, year) values ("user2", "The Trial", "Franz Kafka", 1925);
insert into book (owner, title, author, year) values ("user1", "The Metamorphosis", "", 1915);
insert into book (owner, title, author, year) values ("user1", "Fahrenheit 451", "Ray Bradbury", 1953);
insert into book (owner, title, author, year) values ("user2", "Gaudy Night", "Dorothy L. Sayers", 1935);
insert into book (owner, title, author, year) values ("user1", "God Emperor of Dune", "Frank Herbert", 1981);
insert into book (owner, title, author, year) values ("user2", "Gone with the Wind", "Margaret Mitchell", 1936);
insert into book (owner, title, author, year) values ("user2", "Heart of Darkness", "Joseph Conrad", 1899);
insert into book (owner, title, author, year) values ("user1", "Heretics of Dune", "Frank Herbert", 1984);
insert into book (owner, title, author, year) values ("user2", "Adventures of Huckleberry Finn", "Mark Twain", 1884);
insert into book (owner, title, author, year) values ("user1", "Ivanhoe", "Walter Scott", 1819);
insert into book (owner, title, author, year) values ("user2", "Johnny Got His Gun", "Dalton Trumbo", 1939);
insert into book (owner, title, author, year) values ("user1", "Icehenge", "Kim Stanley Robinson", 1984);
insert into book (owner, title, author, year) values ("user2", "Microserfs", "Douglas Coupland", 1995);
insert into book (owner, title, author, year) values ("user2", "Moby-Dick; or, The Whale", "Herman Melville", 1851);
insert into book (owner, title, author, year) values ("user2", "Moonfleet", "J. Meade Falkner", 1898);
insert into book (owner, title, author, year) values ("user1", "Neuromancer", "William Gibson", 1984);
insert into book (owner, title, author, year) values ("user2", "Cryptonomicon", "Neal Stephenson", 1999);
insert into book (owner, title, author, year) values ("user1", "No Logo", "Naomi Klein", 2000);
insert into book (owner, title, author, year) values ("user1", "On War", "Carl von Clausewitz", 1832);
insert into book (owner, title, author, year) values ("user2", "The Three Stigmata of Palmer Eldritch", "Philip K. Dick", 1965);
insert into book (owner, title, author, year) values ("user1", "Time out of Joint", "Philip K. Dick", 1959);
insert into book (owner, title, author, year) values ("user1", "A Scanner Darkly", "Philip K. Dick", 1977);
insert into book (owner, title, author, year) values ("user2", "Radio Free Albemuth", "Philip K. Dick", 1985);
insert into book (owner, title, author, year) values ("user2", "Pride and Prejudice", "Jane Austen", 1813);
insert into book (owner, title, author, year) values ("user1", "Rosencrantz & Guildenstern Are Dead", "Tom Stoppard", 1967);
insert into book (owner, title, author, year) values ("user1", "Ringworld", "Larry Niven", 1970);
insert into book (owner, title, author, year) values ("user2", "Rendezvous with Rama", "Arthur C. Clarke", 1972);
insert into book (owner, title, author, year) values ("user1", "Sense and Sensibility", "Jane Austen", 1811);
insert into book (owner, title, author, year) values ("user2", "Speaker for the Dead", "Orson Scott Card", 1986);
insert into book (owner, title, author, year) values ("user2", "Starship Troopers", "Robert A. Heinlein", 1959);
insert into book (owner, title, author, year) values ("user2", "Sir Gawain and the Green Knight", "Pearl Poet", 2007);
insert into book (owner, title, author, year) values ("user1", "Stuart Little", "E. B. White", 1945);
insert into book (owner, title, author, year) values ("user2", "The Doors of Perception", "Aldous Huxley", 1954);
insert into book (owner, title, author, year) values ("user1", "The Time Machine", "H. G. Wells", 1895);
insert into book (owner, title, author, year) values ("user1", "The Shockwave Rider", "John Brunner", 1975);
insert into book (owner, title, author, year) values ("user1", "The Shining", "Stephen King", 1977);
insert into book (owner, title, author, year) values ("user2", "The Hound of the Baskervilles", "Arthur Conan Doyle", 1901);
insert into book (owner, title, author, year) values ("user1", "The Hobbit", "J. R. R. Tolkien", 1937);
insert into book (owner, title, author, year) values ("user1", "The Great Divorce", "C. S. Lewis", 1945);
insert into book (owner, title, author, year) values ("user2", "The Screwtape Letters", "C. S. Lewis", 1942);
insert into book (owner, title, author, year) values ("user2", "The Pit and the Pendulum", "Nancy Kilpatrick", 1842);
insert into book (owner, title, author, year) values ("user2", "The Hunt for Red October", "Tom Clancy", 1984);
insert into book (owner, title, author, year) values ("user1", "The Cardinal of the Kremlin", "Tom Clancy", 1988);
insert into book (owner, title, author, year) values ("user1", "Tunnel in the Sky", "Robert A. Heinlein", 1955);
insert into book (owner, title, author, year) values ("user2", "The Mismeasure of Man", "Stephen Jay Gould", 1981);
insert into book (owner, title, author, year) values ("user1", "The Picture of Dorian Gray", "Oscar Wilde", 1890);
insert into book (owner, title, author, year) values ("user2", "The Sentinel", "Arthur C. Clarke", 1951);
insert into book (owner, title, author, year) values ("user2", "The Fountains of Paradise", "Arthur C. Clarke", 1979);
insert into book (owner, title, author, year) values ("user2", "Lord of the Flies", "William Golding", 1954);
insert into book (owner, title, author, year) values ("user1", "Through the Looking-Glass", "Lewis Carroll", 1871);
insert into book (owner, title, author, year) values ("user1", "Waiting for Godot", "Samuel Beckett", 1952);
insert into book (owner, title, author, year) values ("user2", "The Wanderer", "Fritz Leiber", 1964);
insert into book (owner, title, author, year) values ("user1", "2010: Odyssey Two", "Arthur C. Clarke", 1982);
insert into book (owner, title, author, year) values ("user2", "Aeneid", "Virgil", 1943);
insert into book (owner, title, author, year) values ("user2", "Paradise Lost", "John Milton", 1667);
insert into book (owner, title, author, year) values ("user1", "The Invisible Man", "H. G. Wells", 1897);
insert into book (owner, title, author, year) values ("user1", "Twenty Thousand Leagues Under the Sea", "Emanuel J Mickel", 1869);
insert into book (owner, title, author, year) values ("user1", "Keep the Aspidistra Flying", "George Orwell", 1936);
insert into book (owner, title, author, year) values ("user1", "Lions' Commentary on UNIX 6th Edition, with Source Code", "John Lions", 1996);
insert into book (owner, title, author, year) values ("user2", "The Myth of Sisyphus", "Albert Camus", 1942);
insert into book (owner, title, author, year) values ("user1", "Northanger Abbey", "Jane Austen", 1817);
insert into book (owner, title, author, year) values ("user1", "The Eye of the World", "Robert Jordan", 1990);
insert into book (owner, title, author, year) values ("user1", "The Great Hunt", "Robert Jordan", 1990);
insert into book (owner, title, author, year) values ("user1", "A Crown of Swords", "Robert Jordan", 1996);
insert into book (owner, title, author, year) values ("user1", "Winter's Heart", "Robert Jordan", 2000);
insert into book (owner, title, author, year) values ("user2", "The Grapes of Wrath", "John Steinbeck", 1939);
insert into book (owner, title, author, year) values ("user1", "How Green Was My Valley", "Richard Llewellyn", 1939);
insert into book (owner, title, author, year) values ("user1", "The Queen of the Damned", "Anne Rice", 1988);
insert into book (owner, title, author, year) values ("user2", "Gulliver's Travels", "Jonathan Swift", 1726);
insert into book (owner, title, author, year) values ("user2", "The Color Purple", "Alice Walker", 1982);
insert into book (owner, title, author, year) values ("user1", "A Midsummer Night's Dream", "William Shakespeare", 1600);
insert into book (owner, title, author, year) values ("user1", "The English Patient", "Michael Ondaatje", 1992);
insert into book (owner, title, author, year) values ("user2", "Captains Courageous", "Rudyard Kipling", 1897);
insert into book (owner, title, author, year) values ("user1", "The Forge of God", "Greg Bear", 1987);
insert into book (owner, title, author, year) values ("user1", "Blood Music", "Greg Bear", 1985);
insert into book (owner, title, author, year) values ("user2", "The World According to Garp", "John Irving", 1978);
insert into book (owner, title, author, year) values ("user2", "Mutiny on the Bounty", "James Norman Hall", 1932);
insert into book (owner, title, author, year) values ("user1", "The Mothman Prophecies", "John A. Keel", 1975);
insert into book (owner, title, author, year) values ("user1", "Sixth Column", "Robert A. Heinlein", 1949);
insert into book (owner, title, author, year) values ("user2", "The Wind in the Willows", "Kenneth Grahame", 1908);
insert into book (owner, title, author, year) values ("user1", "The Hunting of the Snark", "Lewis Carroll", 1876);
insert into book (owner, title, author, year) values ("user1", "Jonathan Livingston Seagull", "Richard Bach", 1970);
insert into book (owner, title, author, year) values ("user2", "I Am Legend", "Richard Matheson", 1954);