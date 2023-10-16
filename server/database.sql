
CREATE TABLE UserInfo (
    userId SERIAL PRIMARY KEY,
    email Varchar(60),
    username Varchar(20),
    password Varchar(30),
    celeb BOOLEAN,
    celebId INT REFERENCES Celeb(celebId),
);


CREATE TABLE Celeb (
    celebId SERIAL PRIMARY KEY,
    email Varchar(60),
    username Varchar(20),
    password Varchar(30),
    amount_charge INT,
    request_num INT,
    Category Varchar(20)
);

CREATE TABLE Fan (
    fanId SERIAL PRIMARY KEY,
    email VARCHAR(20),
    username VARCHAR(20),
    total_spent INT,
    fav_categories VARCHAR(20),
    num_Of_Requests INT,
);

CREATE TABLE Video (
    videoId SERIAL PRIMARY KEY,
    description VARCHAR(20),
    upload_date DATE,
    views INT,
    likes INT,
    celebId INT REFERENCES Celeb(celebId)
);

CREATE TABLE Message (
    MessageId SERIAL PRIMARY KEY,
    senderId INT,
    recipient INT,
    MessageContent Varchar(350),
    timing timestamp,
    read_status BOOLEAN
);

CREATE TABLE Requests (
    requestId serial primary key,
    requesterId int,
    request_message Varchar(500),
    creatorId INT,
    requestStatus Varchar(10) //(pending, accepted, completed),
    req_type Varchar(8), //(vid, message, audio),
    status VARCHAR(12), // (fulfilled, pending, canceled, etc),
    TimeStamp1 timestamp, (when has the req been made),
    TimeStamp2 timestamp (when has the req been fuliffled)
);



CREATE TABLE Transactions (
    transactionId serial primary key,
    payeeId INT //foreign key,
    payerId INT //foreign key,
    amount INT,
    status VARCHAR(12),
    payement_date timestamp
);