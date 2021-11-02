const Course = require("./Models/course");
const mongoose = require('mongoose');

const getSchedule = async () => {

    //friday -> Begin End Time
    await mongoose.connect('mongodb+srv://alwihaque:alwi1234@cluster0.ua0zj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
    const courses = ['CS 370', 'CS 350', 'CPLT 202W', 'ECON 215', 'CS 326'];
    const maxCredit = 19;
    const schedule = [];
    const availabilities = {
        '2': {
            start: 8,
            end: 20
        },
        '3': {
            start: 9,
            end: 18
        },
        '4': {
            start: 8,
            end: 16.50
        },
        '5': {
            start: 8,
            end: 20
        },
        '6': {
            start: 12,
            end: 20
        }
    }
    const validSections = [];
    let sections;
    for (const course of courses) {
        sections = await Course.find({code: course});
        //console.log(sections);
        for await  (const section of sections) {
            for (let day in availabilities) {

                if (section.meeting.find(meeting => parseInt(day) === meeting[0] && meeting[1] >= availabilities[day].start && availabilities[day].end <= meeting[2])) {
                    validSections.push(section);
                    console.log(validSections);
                }


            }

        }

    }
    if(validSections.length === 0) {
        console.log('Pick Courses');
    }
    return scheduleBuilder(validSections, maxCredit);
}

const scheduleBuilder = (sections, maxCredit) => {
    let maximumCredit = 0;

    let maxSchedule = [];

    for(let i = 0; i < sections.length; i++) {
        let runningCredit = 0;
        let schedule = [];
        schedule.push(sections[i]);
        runningCredit += sections[i].creditHours;
        for(let j = i + 1; j < sections.length; j++) {
            if(schedule.find(x => x.code === sections[j].code)) {
                continue;
            }
            if(runningCredit + sections[j].creditHours > maxCredit) {
                continue;
            }
            let notOverlap;
            for(let meet of sections[j].meeting) {
                notOverlap = schedule.find(course => {
                    return course.meeting.find(time => time[2] > meet[1] && meet[2] > time[1] && time[0] === meet[0]);
                });
                if(!notOverlap) {
                    break;
                }
            }
            if(notOverlap) {
                schedule.push(sections[j]);
                runningCredit += sections[j].creditHours;
            }
        }
        //console.log(schedule);
        maximumCredit = Math.max(runningCredit, maximumCredit);
        if(maximumCredit === runningCredit) {
            maxSchedule = schedule;

        }
    }
    return maxSchedule;

}

getSchedule().then(x => {
    console.log(x);
});