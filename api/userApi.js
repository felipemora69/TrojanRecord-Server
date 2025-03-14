import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validor from 'validator';

//const jwtSecret = process.env.JWT_SECRET;

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User Doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = createToken(user._id);
        res.json({ token });

    } catch (error) {
        console.log(error);
        res.json({ message: 'Server Error' });
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (!validor.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel ({
            name: name,
            email: email,
            password: hashedPassword,
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({ token });

    } catch (error) {
        console.log(error);
        res.json({ message: 'Server Error' });
    }
}

export { loginUser, registerUser };

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'Please fill all fields' });
//     }

//     try {
//       // Connect to the database
//       await connectDB();

//       // Check if the user exists
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: 'User already exists' });
//       }

//       // Hash password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       // Create a new user
//       const user = new User({
//         name,
//         email,
//         password: hashedPassword,
//       });

//       // Save the user to the database
//       await user.save();

//       // Create JWT token
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: '1h',
//       });

//       res.status(201).json({ token });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server Error' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }