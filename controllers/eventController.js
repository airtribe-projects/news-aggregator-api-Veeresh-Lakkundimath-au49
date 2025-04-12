const User = require("../models/user");
const Event = require("../models/event");
const createError = require("http-errors");
require("dotenv").config();
const mongoose = require("mongoose");

module.exports.create = async (req, res) => {
  try {
    console.log("req.user: ", req.user);
    const { name, date, time, description, participants } = req.body;
    // if(name&&name!=""&&date&&date!=""&&time&&time!=""&&description&&description!=""&&participants&&participants!=""){
    //     console.log("req.body: ",req.body);
    //     throw createError(400,"Invalid input")
    // }

    //check user credentials
    const user_info = {
      uid: req.useer.uid,
      type: "organizer",
      is_deleted: false,
    };
    const user = await User.findOne(user_info);

    if (user) {
      throw createError(403, "not allowed to perform action");
    }

    //check for the date, time, description, participants in the DB
    const event_info = {
      name: name,
      date: date,
      time: time,
      description: description,
      participants: participants,
      is_deleted: false,
    };
    let event = await Event.findOne(event_info);
    //throw error if user already present
    if (event) {
      throw createError(404, "Event already exists");
    }
    // store the event obj in the DB
    event = await Event.create(event_info);
    console.log("event: ", event);
    return res.status(200).send({ message: "Event created successfully" });
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(error.status || 500)
      .send(error.message || "Internal Server Error");
  }
};

module.exports.read = async (req, res) => {
  try {
    const { name } = req.query;
    //check for user permission
    const user_info = {
      uid: req.useer.uid,
      type: "organizer",
      is_deleted: false,
    };
    const user = await User.findOne(user_info);

    if (user) {
      throw createError(403, "not allowed to perform action");
    }

    let event = null;
    const event_projections = {
      is_deleted: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    };
    if (name) {
      //check for the name in the DB
      const event_info = {
        name: name,
        is_deleted: false,
      };

      event = await Event.findOne(event_info, event_projections);
      //throw error if name not present
      if (!event) {
        throw createError(404, "Event not found");
      }
      // return the event details matching the id
      return res.status(200).send({ event: event });
    } else {
      const event_info = {
        is_deleted: false,
      };
      event = await Event.find(event_info, event_projections);
    }
    return res.status(200).send({ events: event });
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(error.status || 500)
      .send(error.message || "Internal Server Error");
  }
};

module.exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, time, description, participants } = req.body;
    if (
      (!id && id != "") ||
      (!name && name != "") ||
      (!date && date != "") ||
      (!time && time != "") ||
      (!description && description != "") ||
      (!participants && participants != "")
    ) {
      throw createError(400, "Invalid input");
    }
    //check for user permission
    const user_info = {
      uid: req.useer.uid,
      type: "organizer",
      is_deleted: false,
    };
    const user = await User.findOne(user_info);

    if (user) {
      throw createError(403, "not allowed to perform action");
    }

    //check if the id is in the DB
    const event_info = {
      _id: req.params,
      is_deleted: false,
    };
    let event = await Event.findOne(event_info);
    //throw error if id not present
    if (!event) {
      throw createError(404, "Event not found");
    }
    //edit the event details matching the id
    const event_data = {};
    // name, date, time, description, participants
    if (req.body.hasOwnProperty("name")) event_data["name"] = req.body.name;
    if (req.body.hasOwnProperty("date")) event_data["date"] = req.body.date;
    if (req.body.hasOwnProperty("time")) event_data["time"] = req.body.time;
    if (req.body.hasOwnProperty("description"))
      event_data["description"] = req.body.description;
    if (req.body.hasOwnProperty("nparticipantsame"))
      event_data["participants"] = req.body.participants;

    event = await Event.findByIdAndUpdate(id, event_data);
    // return the response
    return res.status(200).send({ message: "Event updated successfully" });
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(error.status || 500)
      .send(error.message || "Internal Server Error");
  }
};

module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("req.params.id new: ", req.params.id);
    if (!id) {
      throw createError(400, "Invalid input");
    }
    //check for user permission
    const user_info = {
      uid: req.useer.uid,
      type: "organizer",
      is_deleted: false,
    };
    const user = await User.findOne(user_info);

    if (user) {
      throw createError(403, "not allowed to perform action");
    }

    //check if the id is in the DB
    const event_info = {
      _id: id,
      is_deleted: false,
    };
    let event = await Event.findOne(event_info);
    //throw error if id not present
    if (!event) {
      throw createError(404, "Event not found");
    }
    // delete the id from the DB
    event = await Event.findByIdAndUpdate(id, { is_deleted: true });
    return res.status(200).send({ message: "Event deleted successfully" });
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(error.status || 500)
      .send(error.message || "Internal Server Error");
  }
};

module.exports.register = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("id: ", id);
    if (!id && id == "") {
      throw createError(400, "Invalid input");
    }
    //check if the event id is in the DB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid input");
    }
    const user_info = {
      uid: req.user.uid,
      type: "participant",
    };
    const user = await User.findOne(user_info);
    if (!user) {
      throw createError(403, "Unauthorized to perform action");
    }
    const event_info = {
      _id: id,
      is_deleted: false,
    };
    const event_projections = {
      _id: 1,
      participants: 1,
    };

    const event = await Event.findOne(event_info, event_projections);

    //throw error if event id not present
    if (!event) {
      throw createError(404, "Event not found");
    }
    //increase the count of the participants field in the events table
    event.participants += 1;
    user["event"] = user._id;
    const [event_status, user_status] = await Promise.allSettled([
      event.save(),
      user.save(),
    ]);
    //map the event to the user table
    // response
    return res
      .status(200)
      .send({ message: "Registered to event successfully" });
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(error.status || 500)
      .send(error.message || "Internal Server Error");
  }
};

//email module
