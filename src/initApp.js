import connection from "../DB/connection.js";
export const initApp = (app, express) => {
    connection();
    app.use(express.json());
}