const userModel = require("../models/user.model");
const mongoose = require(`mongoose`);

const followUser = async (req, res) => {
  const { user } = req.body;
  const userFound = await userModel.findOne({ user_name: user });

  if (String(userFound?._id) === String(req._id)) {
    res.status(400).send(`CANNOT FOLLOW YOURSELF`);
  } else if (!userFound) {
    res.status(400).send(`THE USER YOU WANT TO FOLLOW DOES NOT EXIST`);
  } else {
    try {
      //add the current user to the followers of the user he wants to follow
      const followers = userFound.followers;
      const followed = followers.find(
        (f) => String(f) === String(userFound._id)
      );
      if (!followed) {
        followers.push(new mongoose.mongo.ObjectId(userFound._id));
      }

      // add the user the current user wants to follow to its followings
      const currentUser = await userModel.findById(req._id);
      const followings = currentUser.followings;
      const followinged = followings.find(
        (f) => String(f) === String(currentUser._id)
      );
      if (!followinged) {
        followings.push(new mongoose.mongo.ObjectId(currentUser._id));
      }

      await userFound.save();
      await currentUser.save();

      if (followed) {
        res.status(401).send(`already following user`);
      } else {
        res.status(201).send(`Succesfully followed user`);
      }
    } catch (error) {
      res.status(403).send(error);
    }
  }
};

const unfollowUser = async (req, res) => {
  const { user } = req.body;
  const userFound = await userModel.findOne({ user_name: user });

  if (String(userFound?._id) === String(req._id)) {
    res.status(400).send(`CANNOT UNFOLLOW YOURSELF`);
  } else if (!userFound) {
    res.status(400).send(`THE USER YOU WANT TO FOLLOW DOES NOT EXIST`);
  } else {
    try {
      //remove the current user to the followers of the user he wants to unfollow
      const followers = userFound.followers;
      const followed = followers.find(
        (f) => String(f) === String(userFound._id)
      );
      if (followed) {
        followers.splice(followers.indexOf(followed), 1);
      }

      // remove the user the current user wants to unfollow to its followings
      const currentUser = await userModel.findById(req._id);
      const followings = currentUser.followings;
      const followinged = followings.find((f) => String(f) === String(req._id));
      if (!followinged) {
        followings.splice(followings.indexOf(followinged), 1);
      }

      await userFound.save();
      await currentUser.save();

      if (!followed) {
        res.status(401).send(`already not following user`);
      } else {
        res.status(201).send(`Succesfully unfollowed user`);
      }
    } catch (error) {
      res.status(403).send(error);
    }
  }
};

module.exports = { followUser, unfollowUser };
