const Course = require("../Models/course");
const Schedule = require("../Models/courseSchedule");
const Building = require("../Models/building");
const logger = require('../Util/logger');
const User = require('../Models/user');
const {
    MinPriorityQueue
} = require('@datastructures-js/priority-queue');
const course = require("../Models/course");

module.exports.getCourses = async (req, res, next) => {
    const courses = await Course.find({});
    res.status(200).send(courses);
}
module.exports.getCourse = async (req, res, next) => {
    const courseCode = req.params.courseCode;
    try {
        const course = await Course.findOne({courseCode});
        res.status(200).send(course);
    } catch (e) {
        logger.log('error', e.message);
        res.status(400).send(e.message);
    }
}
module.exports.getCourseById = async (req, res, next) => {
    const courseId = req.params.id;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new Error('Course Not Found');
        }
        res.status(200).send(course);
    } catch (e) {
        logger.log('error', e.message);
        res.status(400).send(e.message);
    }

}

module.exports.getSpecifiedCourses = async (req, res, next) => {
    if(param === NULL) {

    }
    const param = req.params.prefix.toUpperCase();
    try {
        const courses = await Course.find({code: param});
        if(!courses || courses.length === 0) {
            throw Error("Course Not Found\n");
        }
        console.log()
        res.status(200).send(courses);
    } catch (e) {
        console.log(e.message);
        res.status(400).send(e.message);
    }
}
module.exports.getSchedule = async (req, res, next) => {
    const uid = req.body.uid;
    try {
        const user = await User.findById(uid);
        if (user.courseSchedules === null || user.courseSchedules === undefined) {
            throw new Error('User Not Found\n');
        }
        //get schedule
        const courseSchedule = await Schedule.find(user.courseSchedules[0]);
        if (courseSchedule === null || courseSchedule === undefined || courseSchedule.length === 0) {
            throw new Error('Schedule Not Found\n');
        }
        const courses = [];
        const courseIds = courseSchedule.courses;
        for (let courseId of courseIds) {

            const course = await Course.find(courseId);
            if (course === null || course === undefined) {
                throw Error('Course No Longer In Database\n');
            }
            courses.push(course);


        }
        res.status(200).send(courses);
    } catch (e) {

        res.status(400).send(e.message);

    }

};

module.exports.generateSchedule = async (req, res, next) => {
    const uid = req.body.uid;
    const courses = req.body.courses;
    const sem = req.body.semester;

    try {
        const user = await User.findById(uid);
        const coursesTaken = user.coursesTaken;
        const maxCredit = user.maxCredit;
        const minCredit = user.minCredit;
        const availabilities = user.availabilities;
        /*
        {

        }
        */

        const validSections = [];
        let sections;
        for (const course of courses) {
            let skip = 0;
            if (coursesTaken != null) {
                for (const taken of coursesTaken) { /*check course not  taken*/
                    if (taken === course) {
                        skip = 1;
                        break;
                    }
                }
            }
            if (skip) {
                continue;
            }
            sections = await Course.find({code: course});
            for await (const section of sections) {
                for (let day in availabilities) {
                    if (section.semester === sem && section.meeting.find(meet => parseInt(day) === meet[0] && meet[1] >= availabilities[day].start && meet[2] <= availabilities[day].end)) {
                        validSections.push(section);
                    }

                }

            }

        }
        if (validSections.length === 0) {
            console.log('Pick Courses');
        }
        const s = await scheduleBuilder(validSections, maxCredit, minCredit);
        const bestSchedule = new Schedule({
            credits: s[1],
            courses: s[0]
        });
        await bestSchedule.save();
        // console.log(bestSchedule.id);

        // const courseIds = bestSchedule.map(course => {
        //     return new mongoose.Types.ObjectId(course._id);
        // })

        user.courseSchedules.push(bestSchedule.id);
        await user.save();
        return res.status(200).send(bestSchedule);
    } catch (e) {
        logger.log('error', e.message);
        res.status(400).send(e.message);

    }

}
const scheduleBuilder = async (sections, maxCredit, minCredit) => {
    let maximumCredit = 0;
    // let maxSchedule = new MinPriorityQueue();

    let maxSchedule = new MinPriorityQueue({
        priority: (a) => a[1]               //Should be a min queue with priority based off element 1 in the array
    });

    for (let i = 0; i < sections.length; i++) {
        let runningCredit = 0;
        let schedule = [];
        schedule.push(sections[i]);
        //make sure first course fits in credit limit
        if (parseInt(sections[i].creditHours) > maxCredit) {
            continue;
        }
        runningCredit += parseInt(sections[i].creditHours);
        for (let j = i + 1; j < sections.length; j++) {
            if (schedule.find(x => x.code === sections[j].code)) {
                continue;
            }
            if (runningCredit + parseInt(sections[j].creditHours) > maxCredit) {
                continue;
            }
            let notOverlap = true; //true for not meeting case
            for (let meet of sections[j].meeting) {
                notOverlap = schedule.find(course => {
                    return course.meeting.find(time => (time[0] !== meet[0]) || (time[0] === meet[0] && (meet[1] > time[2] || meet[2] > time[1])));
                });
                if (!notOverlap) {
                    break;
                }
            }
            if (notOverlap) {
                schedule.push(sections[j]);
                runningCredit += parseInt(sections[j].creditHours);
            }
        }
        //ensure minCredit
        if (runningCredit < minCredit && typeof schedule != undefined) {
            schedule.forEach(course => {
                if (course.creditHours.indexOf('-') != -1) {
                    runningCredit += Math.min(parseInt(course.creditHours.substring(course.creditHours.indexOf('-') + 1)) - parseInt(course.creditHours.substring(0, course.creditHours.indexOf('-'))), maxCredit - runningCredit);
                }
            })
        }

        if (maximumCredit === runningCredit) {
            let num = await DistanceCalculator(schedule);
            maxSchedule.enqueue([[schedule, runningCredit], num]);
        } else if (maximumCredit < runningCredit) {
            maxSchedule = new MinPriorityQueue({ //Reset priority queue
                priority: (a) => a[1]
            });
            let num = await DistanceCalculator(schedule);
            maxSchedule.enqueue([[schedule, runningCredit], num]);
            maximumCredit = runningCredit;
        }
    }
    //console.log(maxSchedule.dequeue());
    return maxSchedule.dequeue().element[0]; //Since breaking ties with walking time,just return minimum from the minqueue
}

const DistanceCalculator = async (schedule) => {
    //cycle through days
    let walkingTime = 0;
    for (let i = 2; i < 7; i++) { //Traverse days
        let courseOrder = new MinPriorityQueue({
            priority: (a) => a[1]               //Should be a min queue with priority based off element 1 in the array
        });
        for (let j = 0; j < schedule.length; j++) { //Traverse courses
            //console.log("course " + j + " " + schedule[j] + (schedule));
            if (schedule[j].meetingInfo !== "No meeting info" && schedule[j].meetingInfo != undefined) {
                for (let k = 0; k < schedule[j].meeting.length; k++) { //Grab meeting times for each day. Priority based on start time
                    //console.log("check match " + schedule[j].meeting[k][0] + " " + i);
                    if (schedule[j].meeting[k][0] === i) {
                        courseOrder.enqueue([schedule[j].meetingInfo, schedule[j].meeting[k][1]]);
                        //console.log("enqueue " + i + " " + schedule[j].meetingInfo);
                    }
                }
            }
        }
        //console.log(courseOrder.dequeue());
        let prevCourse;
        if (!courseOrder.isEmpty()) {
            prevCourse = courseOrder.dequeue().element[0];
        }//Store the course (not the priority)
        while (!courseOrder.isEmpty()) {
            let currCourse = courseOrder.dequeue().element[0];

            prevCourse = checkCourseName(prevCourse);
            currCourse = checkCourseName(currCourse);
            //console.log("updated names: " + prevCourse + " / " + currCourse);
            let loc1 = await Building.findOne({name: {"$regex": prevCourse}});
            for (let k = 0; k < loc1.to.length; k++) {
                if (loc1.to[k].name === currCourse) {
                    // console.log(prevCourse + " -> " + currCourse + " " + loc1.to[k].time);
                    walkingTime += loc1.to[k].time;
                    break;
                }
            }
            prevCourse = currCourse;
        }
    }
    return walkingTime;
}

const checkCourseName = (course) => {
    if (course.includes("Math") && course.includes("Science")) {
        return "Math and Science Center";
    }

    if (course === "Online") {
        return "Woodruff Library";
    }
    for (let i = course.length - 1; i >= 0; i--) {
        if (course[i] === ' ') {
            return course.substring(0, i);
        }
    }
}