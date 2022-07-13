-- users
create table users (
    id serial primary key,
    username varchar(50) unique not null,
    password varchar(255) not null
);

-- leaderboard
create table scores (
    id serial primary key,
    owner varchar(50) references users(username),
    wpm int not null,
    time_of date not null default now()
);