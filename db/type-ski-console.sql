-- users
create table users (
    id serial primary key,
    username varchar(50) unique not null,
    password varchar(255) not null
);

insert into users (username, password) values('test', 'test');

insert into scores (owner, wpm) values('user1', '105');

select * from scores
order by wpm desc
limit 10;

select * from users;

select * from users where username = 'user3' and password = '$2a$10$fDZTZbQxMcV8/XvKPGFDJO7xMKvAk7hLldpHCgE9h0N5gkXKPSgju';

delete from scores where id > 0;

-- leaderboard
create table scores (
    id serial primary key,
    owner varchar(50) references users(username),
    wpm int not null,
    time_of date not null default now()
);