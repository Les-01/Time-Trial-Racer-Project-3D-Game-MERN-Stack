// This requires 'socket.io' then sets it as the value of the variable 'socketIO'.
const socketIO = require('socket.io');
// This requires 'cors' then sets it as the value of the variable 'cors'.
const cors = require('cors');
// This declares the variable 'io'.
let io;

// This exports the module containing the initialisation function for Socket.IO.
module.exports = {
    // Here the method 'init' is declared and is passed the parameter 'httpServer'.
    init: (httpServer) => {
        // This initialises the variable 'io', then creates a SocketIO instance using the passed HTTP server, and 
        // This creates a SocketIO instance using the passed HTTP server, then assigns it as the value of the variable 'io'.
        io = socketIO(httpServer, {
            // This sets the CORS configuration for Socket.IO.
            cors: {
                // Here the 'origin' is set as "*" which allows requests from any origin (all origins).
                origin: "*",
                // This specifies the allowed HTTP methods (GET, POST, DELETE, PATCH).
                methods: ['GET', 'POST', 'DELETE', 'PATCH']
            }
        });
        // This returns the initialised 'Socket.IO' instance back once the 'init' function is called.
        return io;
    },
    // Here the method 'getIO' is declared.
    getIO: () => {
        // This 'IF; statement uses a conditional statement using '(!io)' which checks whether the io variable holding the Socket.IO instance is initialised. If it isn't execute the code block.
        if (!io) {
            // This creates the error message 'Socket.IO not initialised!'.
            throw new Error('Socket.IO not initialised!');
        }
        // This logs to the console 'Socket.IO initialised!'.
        console.log('Socket.IO initialised')
        // This returns the initialised 'Socket.IO' instance back once the 'getIO' function is called.
        return io;
    }
};