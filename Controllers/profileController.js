
const User = require('../Models/user');

module.exports.setPreferences = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const minCredit = req.body.minCredit;
        const maxCredit = req.body.maxCredit;
        const gradTerm = req.body.graduationTerm;
        // availabilities expected format
        // {
        //     '2': {
        //     start: 10,
        //         end: 20.00
        // },
        //     '3': {
        //     start: 8,
        //         end: 20.00
        // },
        //     '4': {
        //     start: 8,
        //         end: 20.00
        // },
        //     '5': {
        //     start: 8,
        //         end: 20.00
        // },
        //     '6': {
        //     start: 8,
        //         end: 20.00
        // }
        // }
        // where 2 is monday, 3 is tuesday, 4 is friday and so on
        const availabilities = req.body.availabilities;

        const user = await User.findById(uid);
        user.graduationTerm = gradTerm;
        user.minCredit = minCredit;
        user.maxCredit = maxCredit;
        user.availabilities = availabilities;
        await user.save();
    }
    catch (e) {
        console.log(e.message);

    }

}