import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";
import User from "../models/User.js";
import Role from "../models/Role.js";

//Se verifica el token
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];

        if (!token) return res.status(403).json({ message: "No token provided" });

        const decoded = jwt.verify(token, SECRET);
        req.userId = decoded.id;

        const user = await User.findById(req.userId, { password: 0 });
        if (!user) return res.status(404).json({ message: "no user found" });

        next();
            
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
};

//Se verifica si es Moderador
export const isModerator = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        const roles = await Role.find({ _id: { $in: user.roles } });
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
                next();
                return;
            }
        }
        return res.status(403).json({ message: "Require Moderator Role!" });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
};

//Se verifica si es Admin
export const isAdmin = async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      const roles = await Role.find({ _id: { $in: user.roles } });
  
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
  
      return res.status(403).json({ message: "Require Admin Role!" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
  };

  //Se verifica si es premium
  export const isPremium = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        const roles = await Role.find({ _id: { $in: user.roles } });
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "premium") {
                next();
                return;
            }
        }
        return res.status(403).json({ message: "Require Premium Role!" });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
};