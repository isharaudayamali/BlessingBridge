const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    familyName: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    dob: { type: Date, required: true }, // Birthday aniwaaryai
    gender: { type: String, enum: ['Male', 'Female'] },
    
    // Anniversary Details
    anniversary: { type: Date }, // Wedding date eka
    
    // Relationship Logic
    spouse: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Member', 
        default: null 
    },
    
    phone: { type: String },
    category: { 
        type: String, 
        enum: ['Sunday School', 'Youth', 'Elders', 'Choir'], 
        default: 'Elders' 
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true, strict: false });

memberSchema.index({ email: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Member', memberSchema);
