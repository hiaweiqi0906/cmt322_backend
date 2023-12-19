const returnRes = (res, code, message) => {
    return res.status(code).send({
        status: code,
        message,
    });
}

module.exports = {
    returnRes
};
