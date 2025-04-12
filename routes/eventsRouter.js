const express = require("express");
const Authorizer = require("../authorizer");
const Event = express.Router();
const event = require("../controllers/eventController");

Event.use(Authorizer);

Event.post("/",event.create);
Event.get("/",event.read);
Event.put("/:id",event.update);
Event.delete("/:id",event.delete);
Event.post("/:id/register",event.register);

module.exports = Event;