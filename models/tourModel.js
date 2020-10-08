const mongoose = require("mongoose");
const slugify = require("slugify");
const tourSchema = new mongoose.Schema({
            name: {
                        type: String,
                        required: [true, 'A tour must have a name'],
                        unique: true,
                        trim: true,
                        maxlength: [40, 'A tour name must have less or equal than 40 characters'],
                        minlength: [10, 'A tour name must have more or equal than 10 characters']
            },
            duration: {
                        type: Number,
                        required: [true, 'A tour must have a duration']
            },
            maxGroupSize: {
                        type: Number,
                        required: [true, 'A tour must have a max group size']
            },
            difficulty: {
                        type: String,
                        required: [true, 'A tour must have a difficulty'],
                        enum: {
                                    values: ["easy", "medium", "difficult"],
                                    message: "Diffuculty is either easy,medium and difficult"
                        }
            },
            ratingAverage: {
                        type: Number,
                        default: 4.5,
                        min: [1, 'Rating must be above 1.0'],
                        max: [5, 'Rating must be equal or less than 5']
            },
            ratingQuantity: {
                        type: Number,
                        default: 0
            },

            price: {
                        type: Number,
                        required: [true, 'A tour must have a price']
            },

            summary: {
                        type: String,
                        trim: true,
                        required: true
            },
            priceDiscount: {
                        type: Number
            },
            description: {
                        type: String,
                        trim: true
            },
            imageCover: {
                        type: String,
                        required: [true, 'A tour must have a cover image']
            },
            images: [String],
            slug: String,
            createdAt: {
                        type: Date,
                        default: Date.now(),
                        select: false
            },
            startDates: [Date],

            secretTour: {
                        type: Boolean,
                        default: false
            }
}, {
            toJSON: { virtuals: true },
            toObject: { virtuals: true }

});

tourSchema.virtual('durationWeeks').get(function () {
            return this.duration / 7;
})

//DOC middleware-runs before save and .create command
tourSchema.pre('save', function (next) {
            this.slug = slugify(this.name, { lower: true });
            next();
})
//afyer doc saved to db
// tourSchema.post('save',function(doc,next){
//             next();
// })

//~Query middleware
tourSchema.pre(/^find/, function (next) {
            this.find({ secretTour: { $ne: true } })

            this.start = Date.now()
            next();
})

tourSchema.post(/^find/, function (doc, next) {
            console.log(Date.now() - this.start)
            next();
})

//~Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
            this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
            next();
})
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;