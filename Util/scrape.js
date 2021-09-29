const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const launchBrowser = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://atlas.emory.edu/', {waitUntil: 'networkidle2'});
    await page.addStyleTag({ content: "{scroll-behavior: auto !important;}" });
    await page.setViewport( { 'width' : 2460, 'height' : 3000 } );
    await page.setUserAgent( 'UA-TEST' );
    await page.select('#crit-camp', 'ATL');
    await page.select('#crit-career', 'UCOL');
    await page.waitForTimeout(2000);
    await page.click('#search-button');
    await page.waitForTimeout(2000);
    let data = [];
    let elements = await page.$$('.result.result--group-start a.result__link');
    for (const elem of elements) {
        //console.log(elem.asElement());
        await elem.click();
        await page.waitForTimeout(2000);
        const content = await page.content();
        const $ = cheerio.load(content);
        const code = $('.dtl-course-code');
        const title = $('.text.col-8.detail-title.margin--tiny.text--huge');

        // const sections = $('.row.noindent .section.section--all_sections a.course-section.course-section.course-section--matched').toArray();
        // console.log(sections.length);
        // for(let i = 0; i < sections.length; i++) {
        //     $(sections[i]).click();
        // }
        // await page.evaluate(() => {
        //     console.log('hergegg')
        //     let elements = document.getElementsByClassName('course-section course-section--viewing course-section--matched');
        //     console.log(elements.length);
        //     for (let element of elements)
        //         element.click();
        // });
        // await page.evaluate(() => {
        //     let elements = $('.course-section.course-section.course-section--matched').toArray();
        //     for (let i = 0; i < elements.length; i++) {
        //         $(elements[i]).click();
        //         setTimeout(() => {
        //
        //         }, 2000);
        //     }
        // });
        code.each(function () {
            console.log($(this).text());
        });
        title.each(function () {
            console.log($(this).text());
        });

        //const section = sections[0];
        //const numSections = sections.length;
        //console.log(numSections);
        // await page.$eval('a.course-section', (elem) => {
        //     elem.click();
        // });
        // await page.evaluate(()=> {
        //     document.querySelectorAll("a.course-section")[0].click();
        // });
        // const places = await page.$$eval('.course-sections a[role="row"]', (elems) => {
        //     const sections = [];
        //     let query = document.querySelector(' .course-sections .course-section.course-section--viewing.course-section--matched');
        //     if (query === null) {
        //         query = document.querySelector(' .course-sections .course-section.course-section--viewing.course-section--not-matched');
        //     }
        //     if (query === null) {
        //         query = document.querySelector('.course-sections .course-section.course-section--matched');
        //     }
        //
        //     for (let i = 0; i < elems.length; i++) {
        //         console.log('----------------');
        //         console.log(query);
        //         console.log('--------------');
        //         //console.log(query);
        //         if (!query) {
        //             break;
        //         }
        //         $('body').on('DOMSubtreeModified', '.dtl-section', function(){
        //             console.log('changed');
        //         });
        //         query.click();
        //         if (query.nextSibling === null) {
        //             break;
        //         }
        //
        //         query = query.nextElementSibling;
        //
        //     }
        //     return sections;
        // });
        // console.log(places);
        // await page.waitForTimeout(3000);
        // const sections = await page.$$('.course-sections a[role="row"]');

        // if(query === null) {
        //     query = await page.$('.course-sections .course-section.course-section--matched');
        // }
        // for(let section of sections) {
        //     await section.click();
        // }
        // for(let i = 0; i < numSections.length; i++) {
        //     await numSections[i].click();
        // if(query === null) {
        //     break;
        // }
        // console.log(query._remoteObject.description);
        // await query.click();
        // // await page.waitForNavigation();
        // const next = await page.evaluateHandle(query => {
        //     console.log(query);
        //     return query.nextSibling;
        // }, query);
        // if(next === null) {
        //     break;
        // }
        // query = next;
        // }

        // let query = await page.$(' .course-sections .course-section.course-section--viewing.course-section--matched');
        // if(query === null) {
        //     query = await page.$(' .course-sections .course-section.course-section--viewing.course-section--not-matched');
        // }
        // if(query === null) {
        //        let query = await page.$('.course-sections .course-section.course-section');
        // let firstChild = (await page.$('.course-sections'))?.$eval('')
        // }

        // const sections = await page.$$('.section__content .course-sections a');
        // for (let i = 0; i < sections.length; i++) {
            // if(!query || query._remoteObject.description === null || query._remoteObject.description === undefined ) {
            //     break;
            // }
            //console.log(sections[i]._remoteObject.preview);
            // const root = await page.$('.section__content .course-sections a');
            // await root.click();
            // const content = await page.content();
            // const $ = cheerio.load(content);
            // await page.waitForTimeout(5000);
            // await sections[i].click();
            // await page.waitForTimeout(5000);

            const enrollmentStatus = $('.text.detail-enrl_stat_html');
            const seats = $('.text.detail-seats');
            const instructionMethod = $('.text.detail-inst_method_code');
            const typicallyOffered = $('.text.detail-crse_typoff_html');
            const requirement = $('.text.detail-clss_assoc_rqmnt_designt_html');
            const courseDec = $('.section.section--description .section__content');
            const courseNotes = $('.section__content .note-wrapper .note-paragraph');
            const courseLocation = $('.section.section--meeting_html .section__content .meet');
            const credits = $('.text.detail-hours_html');
            credits.each(function () {
                console.log($(this).text());
            });
            seats.each(function () {
                console.log($(this).text());
            });
            enrollmentStatus.each(function () {
                console.log($(this).text());
            });
            instructionMethod.each(function () {
                console.log($(this).text());
            });
            typicallyOffered.each(function () {
                console.log($(this).text());
            });
            requirement.each(function () {
                console.log($(this).text());
            });
            courseDec.each(function () {
                console.log($(this).text());
            });
            courseNotes.each(function () {
                console.log($(this).text());
            });
            courseLocation.each(function () {
                console.log($(this).text());
            });

            // if(query._remoteObject.description === 'a.course-section.course-section--viewing.course-section--matched') {
            //     console.log('HEEEERREE');
            //     break;
            // }
            // query = await page.evaluateHandle(el => el.nextSibling , query);
            // if(!query || query._remoteObject.description === null || query._remoteObject.description === undefined ) {
            //     break;
            // }
        // }
        await page.click('.panel.panel--2x.panel--kind-details.panel--visible .panel__content a.panel__back.icon-link');
        await page.waitForTimeout(2000);
        //await page.click(back);
        //console.log(places);
    }

}

launchBrowser();