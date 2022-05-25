import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true, maxLength : 80},
    description: {type: String, required: true, trim: true, minLength: 20},
    createdAt: {type: Date, required: true, default : Date.now},
    hashtags: [{type: String, trim: true}],
    meta:{
        views: {type: Number, default : 0},
        rating: {type: Number, default : 0},
    },
});

// Video 객체를 이용한 함수를 생성 -> video controller 에서 사용가능.
videoSchema.static('formatHashtags', function(hashtags) {
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`))
})

const Video = mongoose.model("Video", videoSchema);
export default Video;











