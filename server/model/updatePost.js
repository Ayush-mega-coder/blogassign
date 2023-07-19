import mongoose from 'mongoose';

const updateRequestSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    updatedData: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      required: true,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const UpdateRequest = mongoose.model('UpdateRequest', updateRequestSchema);

export default UpdateRequest;
