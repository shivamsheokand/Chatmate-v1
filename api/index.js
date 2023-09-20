const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalSrategy = require('passport-local').Strategy;


const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require('jsonwebtoken');

mongoose.connect(
    "mongodb+srv://chatmate:shivamsheokand@cluster0.55bioyq.mongodb.net/",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(() => {
    console.log('connect success');
}).catch((err) => {
    console.log('Connected Filed', err);
})

app.listen(port, () => {
    console.log('Server Running on port 8000');
})

const User = require('./models/user');
const Message = require('./models/message');


// function to the create token for the userid
const createToken = (userid) => {
    //set the token payload
    const payload = {
        userid: userid,
    };

    // Generate the token whit secret key and expiration time
    const token = jwt.sign(payload, "Q$r2K6W*n!jC%Zk", { expiresIn: "1h" });
    return token;
};

//end point for registration of the user

app.post('/register', (req, res) => {
    const { name, email, password, confirmpassword, image } = req.body;

    // create new user

    const newUser = new User({ name, email, password, confirmpassword, image });

    // save the user the Database
    newUser.save().then(() => {
        res.status(200).json({ message: "User register successfully" })
    }).catch((err) => {
        console.log('Error Registring');
        res.status(500).json({ message: "Error registring the user" })
    })
})


// end Points login in that particuler user

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if the email and password are provided
    if (!email || !password) {
        return res.status(404).json({ message: "Email and Passwor are Required" })
    }

    // check for the user in the database
    User.findOne({ email }).then((user) => {
        if (!user) {
            //user not Found
            return res.status(404).json({ message: "User not Found" })
        }

        // compare the provided password with the user's password in the database
        if (user.password !== password) {
            return res.status(404).json({ message: "Invalid Password" })
        }

        const token = createToken(user._id);
        res.status(200).json({ token })
    }).catch((Err) => {
        console.log("error in finding in the user ", Err);
        res.status(500).json({ message: "Internal Server Error" })
    })
});

//end Points to access all the users axpact the user who is currently logged in
app.get('/users/:userid', (req, res) => {
    const loggedInUserid = req.params.userid;

    User.find({ _id: { $ne: loggedInUserid } }).then((user) => {
        res.status(200).json(user);
    }).catch((Err) => {
        console.log("error in finding User", Err);
        res.status(500).json({ message: "Error retrving Users" })
    })
})

// endPoints to send a frnd request to the user
app.post("/friend-request", async (req, res) => {
    const { currentUserid, selectedUserid } = req.body;
    try {
        //update the recepient's friendrequest Array
        await User.findByIdAndUpdate(selectedUserid, {
            $push: { friendRequests: currentUserid }
        })

        // update the sender's friendrequest array
        await User.findByIdAndUpdate(currentUserid, {
            $push: { sentFriendRequest: selectedUserid }
        })

        response.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
})

//endPoints to show all the friend requests of the Particular user

app.get("/friend-request/:userid", async (req, res) => {
    try {
        const { userid } = req.params;
        console.log("Userid:", userid); // Log the user ID for debugging
        // Fetch the user documents based on the userid
        const user = await User.findById(userid).populate('friendRequests', 'name email image').lean();
        console.log("User Data:", user); // Log the user data for debugging
        const friendRequests = user.friendRequests;

        res.json(friendRequests);
    } catch (error) {
        console.error("Error:", error); // Log any errors for debugging
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// end Points to accept a frnd request

app.post("/friend-request/accept", async (req, res) => {
    try {
        const { senderId, recepientId } = req.body;

        //retrieve the documents of sender and the recipient
        const sender = await User.findById(senderId);
        const recepient = await User.findById(recepientId);

        sender.friends.push(recepientId);
        recepient.friends.push(senderId);

        recepient.friendRequests = recepient.friendRequests.filter(
            (request) => request.toString() !== senderId.toString()
        );

        sender.sentFriendRequest = sender.sentFriendRequest.filter(
            (request) => request.toString() !== recepientId.toString
        );

        await sender.save();
        await recepient.save();

        res.status(200).json({ message: "Friend Request accepted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// endpoint to access all friends of the loged in user

app.get('/accepted-friends/:userid', async (req, res) => {
    try {
        const { userid } = req.params;
        const user = await User.findById(userid).populate(
            "friends",
            "name email"
        )

        const acceptedFriends = user.friends;
        res.json(acceptedFriends)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
})

//upload image 
const multer = require("multer");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "files/"); // Specify the desired destination folder
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for the uploaded file
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });
// endpoint to post massege and store the Backend

app.post('/messages', upload.single("imageFile"), async (req, res) => {
    try {
        const { senderId, recepientId, messageType, messageText } = req.body;

        const newMessage = new Message({
            senderId,
            recepientId,
            messageType,
            message: messageText,
            timeStamp: new Date(),
            imageUrl: messageType === "image" ? req.file.path : null,
            // imageUrl: messageType === 'image'
        })
        await newMessage.save();
        res.status(200).json({ message: "message sent Succesfuly" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
})

//end  point to get the user details to desigen the chat room header

app.get("/user/:userid", async (req, res) => {
    try {
        const { userid } = req.params;

        //fetch the user details from the user id
        const recepientId = await User.findById(userid);

        res.json(recepientId)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
})

//end points fetch the message between two users in the chat room

app.get('/messages/:senderId/:recepientId', async (req, res) => {
    try {
        const { senderId, recepientId } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: senderId, recepientId: recepientId },
                { senderId: recepientId, recepientId: senderId }
            ]
        }).populate("senderId", "_id name image");

        res.json(messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// endpoint to delete the message
app.post('/deleteMessages', async (req, res) => {
    try {
        const { messageids } = req.body; // Change 'messages' to 'messageids'

        if (!Array.isArray(messageids) || messageids.length === 0) {
            return res.status(400).json({ message: "Messages not found" });
        }

        await Message.deleteMany({ _id: { $in: messageids } });
        res.json({ message: "Messages deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});


// endpoint  for friend requests sent to particular users

app.get("/friend-request/sent/:userid", async (req, res) => {
    try {
        const { userid } = req.params;
        const user = await User.findById(userid).populate("sentFriendRequest", "name email image").lean();

        const sentFriendRequest = user.sentFriendRequest;

        res.json(sentFriendRequest);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: "Internal Server" });
    }
})

app.get("/friends/:userid", (req, res) => {
    try {
        const { userid } = req.params;

        User.findById(userid).populate("friends").then((user) => {
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }

            const friendids = user.friends.map((friend) => friend._id);

            res.status(200).json(friendids);
        })
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "internal server error" })
    }
})