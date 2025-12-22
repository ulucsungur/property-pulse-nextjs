import { Schema, model, models } from 'mongoose';

// Yorumlar için alt şema (Sub-document)
const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: [true, 'Yorum metni gereklidir']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const BlogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Başlık gereklidir'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'İçerik gereklidir']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: [true, 'Kapak görseli gereklidir']
    },
    tags: {
        type: [String],
        default: []
    },
    category: {
        type: String,
        default: 'Genel'
    },
    comments: [CommentSchema], // Yorumları yazı içinde tutuyoruz
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const Blog = models.Blog || model('Blog', BlogSchema);

export default Blog;
