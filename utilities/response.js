const resObject = {
    'success': false,
    'message': '',
    'data': null
};

module.exports = {
    sendError: (message, data) => {
        data = data || null
        return Object.assign({}, resObject, {
            message: message,
            data: data
        })
    },
    sendSuccess: (message, data) => {
        data = data || null
        return Object.assign({}, resObject, {
            success: true,
            message: message,
            data: data
        })
    }
}
