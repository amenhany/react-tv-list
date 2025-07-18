import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'


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

userSchema.plugin(passportLocalMongoose);


export default mongoose.model('User', userSchema);