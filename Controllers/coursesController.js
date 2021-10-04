const Course = require("../Models/course");
module.exports.getCourses = async (req, res, next) => {
    const courses = await Course.find({});
    res.status(200).send(courses);
}