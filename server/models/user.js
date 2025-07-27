import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'
import cloudinary from '../middleware/uploads.js';


const showSchema = new mongoose.Schema({
  tvmazeId: {
    type: Number,
    required: [true, "Show's TVMaze ID must not be blank"]
  },
  rating: {
    type: Number,
    min: [0, "Show rating must not be less than 1"],
    max: [10, "Show rating must not be greater than 10"]
  }
}, { _id: false, timestamps: true });


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email must not be blank"]
    },
    bio: {
      type: String,
      maxLength: [100, "Bio too long! (Over 100 characters)"]
    },
    avatar: {
      url: String,
      name: String
    },
    showsList: [
        showSchema
    ],
    listTitle: {
      type: String,
      maxLength: [100, "List title too long! (Over 100 characters)"]
    },
    sorting: {
      key: {
        type: String,
        enum: ['name', 'rating', 'dateAdded', 'custom'],
        required: true,
        default: 'dateAdded'
      },
      ascending: {
        type: Boolean,
        required: true,
        default: true
      }
    }
}, { timestamps: true });

userSchema.post('findOneAndDelete', async function(user) {
  if (user?.avatar?.name) {
    await cloudinary.uploader.destroy(user.avatar.name);
  }
});

userSchema.plugin(passportLocalMongoose);


export default mongoose.model('User', userSchema);