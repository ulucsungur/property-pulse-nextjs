import { Schema, model, models } from 'mongoose';

const FaqSchema = new Schema({
    question_tr: { type: String, required: true },
    answer_tr: { type: String, required: true },
    question_en: { type: String, required: true },
    answer_en: { type: String, required: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Faq = models.Faq || model('Faq', FaqSchema);
export default Faq;

// import mongoose from 'mongoose';

// const FaqSchema = new mongoose.Schema({
//     question: {
//         tr: {
//             type: String,
//             required: [true, 'Türkçe soru zorunludur'],
//         },
//         en: {
//             type: String,
//             required: [true, 'English question is required'],
//         }
//     },
//     answer: {
//         tr: {
//             type: String,
//             required: [true, 'Türkçe cevap zorunludur'],
//         },
//         en: {
//             type: String,
//             required: [true, 'English answer is required'],
//         }
//     },
//     isActive: {
//         type: Boolean,
//         default: true,
//     }
// }, {
//     timestamps: true,
// });

// const Faq = mongoose.models.Faq || mongoose.model('Faq', FaqSchema);

// export default Faq;
