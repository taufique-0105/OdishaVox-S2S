import mongoose from 'mongoose';

const contactUSSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        subject: String,
        message: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

const Contact = mongoose.model('Contact', contactUSSchema);
export default Contact;
