
const User = require('../Models/user');
const mongoose = require('mongoose');
const Course = require('../Models/course');
const logger = require('../Util/logger');
module.exports.setMajorAndGrad = async(req, res, next) => {
    const userId = req.params.uid;
    const major = req.body.major;
    const minor = req.body.minor;
    const gradSem = req.body.gradSem;
    const gradYr = req.body.gradYr;
    try {
        const user = await User.findById(userId);
        if(!user) {
            throw new Error("User Doesn't exist");
        }
        user.major = major;
        user.minor = minor;
        user.graduationTerm = {
            semester: gradSem,
            year: gradYr
        };
        await user.save();
        return res.status(200).send(user);
    }
    catch(e) {
        logger.log('error',e.message);
        return res.status(401).send(e.message);
    }

}

module.exports.setPrevCourses = async(req, res, next) => {
    //Need to pass a bunch of codes
    const uid = req.params.uid;
    const courseList = req.body.courseList;
    try {
        const user = await User.findById(uid);
        if(!user) {
            throw new Error("User Doesn't exist");
        }
        const courseIds = await Promise.all(courseList.map(async courseCode => {
            const course = await Course.findOne({code: courseCode});
            return new mongoose.Types.ObjectId(course._id);
        }));
        user.coursesTaken = courseIds;
        await user.save();
        const courseListDetails = [];
        for(let i = 0; i < courseIds.length; i++) {
            const course = await Course.findById(courseIds[i]);
            courseListDetails.push(course);
        }
        return res.status(200).send(courseListDetails);
    }
    catch (e) {
        logger.log('error',e.message);
        return res.status(401).send(e.message);
    }
}

module.exports.setPreferences = async (req, res, next) => {
    const uid = req.params.uid;
    const availabilities = req.body.availabilities;
    try {
        const user = await User.find(uid);
        if(!user) {
            throw new Error("User Doesn't exist");
        }
        user.availabilities = availabilities;
        await user.save();
        return res.status(200).send(user);
    }
    catch (e) {
        logger.log('error',e.message);
        return res.status(401).send(e.message);

    }

}