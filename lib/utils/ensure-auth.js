const tokenService = require('./token-service');

module.exports = function() {
    return (req, res, next) => {
        console.log('check1', req.body);
        const token = req.get('Authorization');
        console.log('token', token);
        tokenService.verify(token)
            .then(payload => {
                req.reviewer = payload;
                next();
            })
            .catch(() => {
                next({code: 401, error: 'Not Authorized'});
            });
    };
};