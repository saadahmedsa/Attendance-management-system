import expresss from "express"
import { checkAuth, login, logout, register } from "../contoller/usercon.js";



const user = expresss.Router();

user.post("/register",register)
user.post("/login",login)
user.post("/logout",logout)
user.get("/checkauth",checkAuth)


export default user