import mongoose from 'mongoose';
import { Password } from '../helpers/password';

// Interface that describes the properties of method 'build'
// that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// taht a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
// we create custom method to allow type definition when creating new user
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // by running bellow code we tell to mongoose that
    // we want to exclude password and __v properties in response object
    toJSON: {
      transform(doc, ret) {
        // ret is return object
        ret.id = ret._id; // assign id a value of _id(standard from mongoose)
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// midleware function in mongoose.
//everytime we attemt to save document in database we are going to execute this fn
userSchema.pre('save', async function (done) {
  // to acces "this" we use function() instead of arrow function
  if (this.isModified('password')) {
    // above code means we want to hash password if it was modified
    // when user just newly created mongoose thinks it modified
    // for example if only e-mail changed password not need to be hashed again
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }

  done(); // mongoose built in method closing all async work to be done
});

// to create custom method in Model itself - use statics
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserAttrs, UserModel>('User', userSchema);

export { User };
