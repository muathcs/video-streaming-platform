CREATE TABLE Celeb (
    celebId SERIAL PRIMARY KEY,
    displayName VARCHAR(60),
    username VARCHAR(24),
    followers INT,
    account VARCHAR(30),
    category VARCHAR(24),
    price INT,
    email VARCHAR(60),
    description VARCHAR(250),
    request_num INT,
    reviews INT,
    uid VARCHAR(42),
    imgUrl Varchar(50)
);


CREATE TABLE Fan (
    fanId SERIAL PRIMARY KEY,
    email VARCHAR(20),
    username VARCHAR(20),
    total_spent INT,
    fav_categories VARCHAR(20),
    num_Of_Requests INT,
    uid VARCHAR(42),
    imgUrl Varchar(50)

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


CREATE TABLE notification (
  notificationId SERIAL PRIMARY KEY,
  intended_uid VARHCHAR(50  ), -- person who will see the request, not the one making it.
  sender_uid VARCHAR(50), -- person who is sending the notification. 
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE Requests (
    requestid serial primary key,
    celebuid varchar(50), --fan
    fanuid varchar(50), --celeb
    price int,
    tosomeoneelse BOOLEAN,
    reqaction char(16),
    fromperson varchar(40),
    toperson varchar(40),
    message Varchar(500),
    reqstatus Varchar(10), -- (pending, accepted, completed),
    reqtype Varchar(8), --(vid, message, audio),
    TimeStamp1 timestamp, --(when has the req been made),
    TimeStamp2 timestamp, -- (when has the req been fuliffled)
    celebmessage varchar(1200),
);


CREATE TABLE Transactions (
    transactionId serial primary key,
    payeeId INT //foreign key,
    payerId INT //foreign key,
    amount INT,
    status VARCHAR(12),
    payement_date timestamp
);