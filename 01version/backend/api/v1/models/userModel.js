import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
    {
        name: {
          type: String,
          required: true,
          trim: true,
          maxlength: 100,
          minlength: 3,
          default: "Anonymous",
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: false, // Make password optional for Google sign-in
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // Allows null values to not violate unique constraint
        },
        profilePicture: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving, only if password is provided and modified
userSchema.pre("save", async function (next) {
    if (this.password && this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) { // If no password, it's a Google login
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
