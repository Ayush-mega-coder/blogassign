import mongoose from 'mongoose';

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    name:{
        type:String,
        required:false
    },
    categories: {
        type: Array,
        required: false   
    },
    createdDate: {
        type: Date
    },
    status:{
        type:String,
        
    },
    reason:{
        type:String,
        
    }
    
    
});


const post = mongoose.model('post', PostSchema);

export default post;