<p align="center">
  <img width="260" height="170" src="https://user-images.githubusercontent.com/71034989/178843268-e9aa0730-886c-4484-b7f2-2cee464c644e.png">
</p>

## Usage

**/frontend**

```bash
npm run dev
```

**/server**

```bash
npm start
```

Setup a postgresSQL server and update the server config in app.js

**example config**

```
const cn = {
  host: "localhost",
  port: 5432,
  database: "typeski",
  user: "postgres",
  password: "postgres",
  max: 30, // use up to 30 connections
};
```

Stack: Vue.js Express Node.js PostgreSQL Vite
