var jwt = require('jsonwebtoken');
const secret = process.env.SECRET

exports.generateToken = (user_info, callback) => {
    let token = jwt.sign({
        data: user_info,
    }, secret, {expiresIn: '24h'});
    return callback(token); 
}

exports.validateToken = (token, callback) => {
    if(!token) {
        return callback(false); 
    }
    jwt.verify(token.replace('Bearer ', ''), secret, function(error, decoded) {
        if(error) {
            return callback(false);
        } else {
            return callback(true)
        }
    })
}

// exports.getUser = (token) => {
//     if(!token) {
//         return false
//     }

//     jwt.verify(token.replace('Bearer ', ''), secret, function(error, decoded) {
//         console.log(decoded);
//         console.log(decoded.data.passenger)
//         if(error) {
//             return "hey"
//         } else {
//             return "hello"
//         }
//     })
// }
