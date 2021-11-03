const Course = require("./Models/course");
const mongoose = require('mongoose');
const getSchedule = async () => {

    //friday -> Begin End Time
    await mongoose.connect('mongodb+srv://alwihaque:alwi1234@cluster0.ua0zj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
    const courses = ['CS 370', 'CS 350','ECON 215', 'CPLT 202W', 'CS 326', 'CS 334','CS 534'];
    const maxCredit = 19;
    const schedule = [];
    const availabilities = {
        '2': {
            start: 10,
            end: 20.00
        },
        '3': {
            start: 8,
            end: 20.00
        },
        '4': {
            start: 8,
            end: 20.00
        },
        '5': {
            start: 8,
            end: 20.00
        },
        '6': {
            start: 8,
            end: 20.00
        }
    }
    const validSections = [];
    let sections;
    for (const course of courses) {
        sections = await Course.find({code: course});
        //console.log(sections);
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
    return scheduleBuilder(validSections, maxCredit);
}

const scheduleBuilder = (sections, maxCredit) => {
   // console.log(sections);
    let maximumCredit = 0;
    //console.log(sections);
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
                console.log('here');
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
        console.log(schedule);
        maximumCredit = Math.max(runningCredit, maximumCredit);
        console.log(maximumCredit);
        if(maximumCredit === runningCredit) {
            maxSchedule = schedule;

        }
    }
    return maxSchedule;

}

getSchedule().then(async x => {
    x.forEach(course => {
        console.log(course.code);
        console.log(course.meeting);
    })
    await mongoose.connection.close();
});