const Course = require("../Models/course");
const logger = require('../Util/logger');
const User = require('../Models/user');
const mongoose = require('mongoose');
module.exports.getCourses = async (req, res, next) => {
    const courses = await Course.find({});
    res.status(200).send(courses);
}
module.exports.getCourse = async (req, res, next) => {
    const courseCode = req.params.courseCode;
    try {
        const course  = await Course.find({courseCode});
        if(!course) {
            throw new Error('Course Not Found');
        }
        res.status(200).send(course);
    }
    catch (e) {
        logger.log('error',e.message);
        res.status(400).send(e.message);
    }
}
module.exports.getCourseById = async (req, res, next) => {
    const courseId = req.params.id;
    try {
        const course  = await Course.findById(courseId);
        if(!course) {
            throw new Error('Course Not Found');
        }
        res.status(200).send(course);
    }
    catch (e) {
        logger.log('error',e.message);
        res.status(400).send(e.message);
    }

}

module.exports.getSpecifiedCourses = async (req, res, next) => {
    const param = req.params.prefix;
    try {
        const courses = await Course.fuzzySearch(param).exec();
        res.status(200).send(courses);
    } catch (e) {
        console.log(e.message);
    }
}


module.exports.generateSchedule = async (req, res, next) => {

    //friday -> Begin End Time
    const uid = req.body.uid;
    //['CS 370', 'CS 350','ECON 215', 'CPLT 202W', 'CS 326', 'CS 334','CS 534']
    const courses = req.body.courses;
    const maxCredit = 19;
    const schedule = [];
    try {
        const user = await User.findById(uid);
        const availabilities = user.availabilities;
        const validSections = [];
        let sections;
        for (const course of courses) {
            sections = await Course.find({code: course});
            for await  (const section of sections) {
                for (let day in availabilities) {
                    if (section.meeting.find(meet => parseInt(day) === meet[0] && meet[1] >= availabilities[day].start &&  meet[2] <= availabilities[day].end)) {
                        validSections.push(section);
                    }
                }

            }

        }
        if(validSections.length === 0) {
            console.log('Pick Courses');
        }
        const bestSchedule =  scheduleBuilder(validSections, maxCredit);
        const courseIds = bestSchedule.map(course => {
            return new mongoose.Types.ObjectId(course._id);
        })
        user.courseSchedules = courseIds;
        await user.save();
        return res.status(200).send(bestSchedule);
    }
    catch (e) {
        logger.log('error', e.message);
        res.status(400).send(e.message);

    }

}
const scheduleBuilder = (sections, maxCredit) => {
    let maximumCredit = 0;
    let maxSchedule = [];

    for(let i = 0; i < sections.length; i++) {
        let runningCredit = 0;
        let schedule = [];
        schedule.push(sections[i]);
        runningCredit += parseInt(sections[i].creditHours);
        for(let j = i + 1; j < sections.length; j++) {
            if(schedule.find(x => x.code === sections[j].code)) {
                continue;
            }
            if(runningCredit + parseInt(sections[j].creditHours) > maxCredit) {
                continue;
            }
            let notOverlap = false;
            for(let meet of sections[j].meeting) {
                notOverlap = schedule.find(course => {
                    return course.meeting.find(time => (time[0]!== meet[0]) || (time[0] === meet[0] && (meet[1] > time[2] || meet[2] > time[1]))  );
                });
                if(!notOverlap) {
                    break;
                }
            }
            if(notOverlap) {
                schedule.push(sections[j]);
                runningCredit += parseInt(sections[j].creditHours);
            }
        }
        maximumCredit = Math.max(runningCredit, maximumCredit);
        if(maximumCredit === runningCredit) {
            maxSchedule = schedule;

        }
    }
    return maxSchedule;

}