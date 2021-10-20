const Course = require("../Models/course");
module.exports.getCourses = async (req, res, next) => {
    const courses = await Course.find({});
    res.status(200).send(courses);
}

module.exports.getSpecifiedCourses = async (req,res,next) => {
    const param = req.params.prefix;
    try {
        const courses = await Course.fuzzySearch(param).exec();
        res.status(200).send(courses);
    }catch (e) {
        console.log(e.message);
    }
}