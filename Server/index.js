const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const transporter = require('./nodemailer');
const session = require('express-session');
const bcrypt = require('bcrypt');
const http = require("http");
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const socketPORT = process.env.PORT || 6969;
const app = express();

app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/ChatApplication');

const { ObjectId } = mongoose.Types;

app.use(bodyParser.json());

app.use(cors());

app.use(session({
  key: 'userLogined',
  secret: 'thisisSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000,
    secure: false
  },
  Logined: false,
  unid: '',
}))

app.use((req, res, next) => {
  if (req.session.user && req.cookies.userLogined) {
    res.send('/home')
  }
  next();
})

app.use(cors());
 

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  friendList: {
    type: Array,
    default: []
  },
  messagesList: {
    type: Array,
    default: []
  },
  notifications: {
    type: [
      {
        id: String,
        from: String,
        frndReq: Boolean
      }
    ],
    default: []
  },
  userCreatedOn: {
    type: Date,
    default: Date.now()
  },
  avatar: String
})
const userModel = mongoose.model('users', userSchema);

let uid;
let userData = {};


// Express route for fetching session data
app.get('/api/login/session', (req, res) => {
  // Assuming the session information is stored in req.session
  const sessionInfo = {
    session: {
      cookie: {
        originalMaxAge: req.session.cookie.originalMaxAge,
        expires: req.session.cookie.expires,
        secure: req.session.cookie.secure,
        httpOnly: req.session.cookie.httpOnly,
        path: req.session.cookie.path
      },
      unid: req.session.unid,
      Logined: req.session.Logined
      // Add any other session properties you need
    }
  };

  // Sending session information as JSON response
  res.json(sessionInfo);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      res.json({ type: false, data: 'Invalid Email' })
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        req.session.unid = user._id;
        req.session.Logined = true;
        // console.log(`Session Data = (${req.session})`);
        req.session.save((err) => {
          if (err) {
            console.error('Error saving session:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }
        })
        // console.log(req.session);
        res.json({ type: true, data: user, id: user._id });
      } else {

        res.json({ type: false, data: 'Invalid Password' });
      }
    }
  } catch (error) {
    console.error('Error while signing user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/log', async (req, res) => {
  res.json(await req.session);
})

app.post('/home/logout', async (req, res) => {
  try {
    if (!req.session) {
      return res.json({ type: 'success', data: 'Logout successful' });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ type: 'success', data: 'Logout successful' });
    });
  } catch (err) {
    console.error('Error during logout:', err);
    res.status(500).json({ message: 'Unable to logout' });
  }
});

app.post('/Register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(password, hashedPassword);
    const userData = await userModel.create({
      name: name.toLowerCase().replace(" ", ""),
      password: hashedPassword,
      email: email.toLowerCase().replace(" ", ""),
    });
    const data = await res.json(userData);
    // console.log(data);
    uid = data.name;
    req.session.userData = data;
    // console.log(req.session.userData);
    res.json(userData, uid);
  } catch (error) {
    console.error('Error creating user:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/api/credentials/valid', async (req, res) => {
  const field = Object.keys(req.body)[0];
  let value = req.body[field];
  try {
    const result = await userModel.find({ [field]: new RegExp(value) });
    if (result.length === 0) {
      res.send(true);
    } else if (result.length > 0) {
      res.send(false);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login/email/verify', (req, res) => {
  const { from, to, subject, text, html } = req.body;

  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json({ type: 'success', message: 'Email sent successfully' });
    }
  });
})

app.get('/api/users', async (req, res) => {
  try {
    const response = await userModel.find({ "name": { "$exists": true } });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/user/data', async (req, res) => {
  const { userId } = req.body;
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const user = await userModel.findById(userId);

    if (user) {
      return res.status(200).json({ data: user });
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/register/avatar/selected', async (req, res) => {
  const { avatar, uid } = req.body;

  try {
    const user = await userModel.findOne({ name: uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await userModel.updateOne(
      { name: uid },
      { $set: { avatar: avatar } }
    );


    if (updatedUser.modifiedCount && updatedUser.acknowledged) {
      return res.status(200).json({ data: user, message: 'Update successful' });
    } else {
      return res.status(500).json({ error: 'Failed to update user avatar' });
    }

  } catch (error) {
    console.error('Error updating user avatar:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/finduser', async (req, res) => {
  const { uid } = req.body;
  try {
    const user = await userModel.findOne({ "name": uid });
    if (!user) {
      res.json({ type: false, data: 'Invalid username' })
    } else {
      res.json({ type: true, data: user, id: user._id });
    }
  } catch (error) {
    console.error('Error while signing user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/api/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const messageSchema = new mongoose.Schema({
  from: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  conversation: [messageSchema]
});

const messageModel = mongoose.model('Messages', roomSchema);
app.post('/chats/message', async (req, res) => {
  const { chatId, currentUser, message } = req.body;

  try {
    console.log("soda pata " + chatId, currentUser, message);

    // Check if the roomId already exists
    const existingRoom = await messageModel.findOne({ roomId: chatId });

    if (existingRoom) {
      // If the roomId exists, append the new message to the conversation array
      const updatedRoom = await messageModel.findOneAndUpdate(
        { roomId: chatId },
        { $push: { conversation: { from: currentUser, message: message } } },
        { new: true } // To get the updated document after the update
      );

      return res.json(updatedRoom);
    } else {
      // If the roomId doesn't exist, create a new room with the first message
      const newRoom = await messageModel.create({
        roomId: chatId,
        conversation: [{
          from: currentUser,
          message: message,
        }],
      });

      return res.json(newRoom);
    }
  } catch (error) {
    console.error('Error creating Message:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/chat/getmessages', async (req, res) => {
  const { roomId } = req.body;
  try {
    const user = await messageModel.findOne({ roomId: roomId });
    res.json(user);
  } catch (error) {
    console.error('Error fetching Message:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/chat/searchUser', async (req, res) => {
  const { name } = req.body;
  try {
    const users = await userModel.find({ name: { $regex: new RegExp(name, 'i') } });
    res.json(users)
  } catch (error) {
    res.status(404).json({ data: null })
  }
})

app.post('/chat/friendrequest', async (req, res) => {
  const { sender, reciver, senderName } = req.body;
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      sender,
      { $push: { friendList: reciver } },
      { new: true }
    );

    const friend = await userModel.findByIdAndUpdate(
      reciver,
      {
        $push: {
          notifications: {
            id: sender,
            from: senderName,
            frndReq: true
          },
        },
      },
      { new: true, upsert: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    return res.json({ user: updatedUser, friend });

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/getNotification', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await userModel.findById(userId);
    console.log(user.notifications);
    res.json(user.notifications)
  } catch (error) {
    res.status(404).json({ notifiactions: null })
  }
})

app.post('/confirmNotification', async (req, res) => {
  const { friendToAdd, userId } = req.body;
  try {

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $push: { friendList: friendToAdd } },
      { new: true }
    );

    console.log(updatedUser);
    res.json(updatedUser)
  } catch (error) {
    res.status(404).json({ notifiactions: null })
  }
})

app.post('/cancelNotification', async (req, res) => {
  const { userId, idToRemove } = req.body;
  try {
    const user = await userModel.updateOne(
      idToRemove,
      { $pull: { friendList: userId } }
    );
    console.log(user);
    res.json(user)
  } catch (error) {
    res.status(404).json({ notifiactions: null })
  }
})





















/*=============================================
=            vedio Calling feature            =
=============================================*/
const server = http.createServer(app)
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: [ "GET", "POST" ]
	}
})


io.on("connection", (socket) => {
  socket.emit("me", socket.id)

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded")
  })

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
  })

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal)
  })
})

server.listen(socketPORT, () => console.log(`server is running on port ${socketPORT}`));

/*=====  End of vedio Calling feature  ======*/




app.listen(PORT, () => {
  console.log(`Express Server Runing on Port ${PORT}`);
  mongoose.connection.on('connected', () => {
    console.log('MonogDb connected Succsesfully');
  })
})