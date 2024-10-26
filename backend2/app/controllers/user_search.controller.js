const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

exports.searchUser = (req, res) => {
    User.aggregate(
        [
            (req.query.username != '' && typeof req.query.username != "undefined") ?
                {
                    $match: {
                        username: req.query.username
                    }
                } : { $project: { __v: 0 } },
            (req.query.email != '' && typeof req.query.email != "undefined") ?
                {
                    $match: {
                        email: req.query.email
                    }
                } : { $project: { __v: 0 } },
            (typeof req.query.mobile != "number") ?
                {
                    $match: {
                        mobile: req.query.mobile
                    }
                } : { $project: { __v: 0 } },
        ]
    ).
        then(docs => {
            res.send({ message: "User data get successfully", data: docs });
        })
        .catch(err => {
            res.status(500).send({ message: err });
        });
}