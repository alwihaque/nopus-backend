const Course = require("../Models/course");
module.exports.getCourses = async (req, res, next) => {
    const courses = await Course.find({});
    res.status(200).send(courses);
}
module.exports.getSpecifiedCourses = async (req,res,next) => {
    const param = req.params.prefix.toUpperCase();
    console.log(param);
    const regexp = new RegExp("^" + param);
    const courses = await Course.find({code: regexp});
    res.status(200).send(courses);
}