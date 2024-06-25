const { create } = require('xmlbuilder2');

function sendJsonOrXML(req, res, next) {
    // Preserve the original res.send and res.json methods
    const originalSend = res.send.bind(res);

    // Override res.send method
    res.send = (data) => {
        const accept = req.headers['accept'];

        if (accept && accept.includes('application/xml')) {
            var wrappedData = { root: data };
            const xml = create({ version: '1.0' }).ele(wrappedData).end({ prettyPrint: true });
            res.type('application/xml');
            return originalSend(xml);
        } else {
            return originalSend(data);
        }
    };

    next();
}

module.exports = sendJsonOrXML;