const Tour = require("../models/tourModel")
const APIFeautures = require("../utils/apiFeauture");
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError");

exports.aliasTopTours = (req, res, next) => {
            req.query.limit = '5';
            req.query.sort = '-ratingsAverage,price';
            req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
            next();
}

exports.getAllTours = catchAsync(async (req, res, next) => {


            //^Build query
            const feautures = new APIFeautures(Tour.find(), req.query).filter().sort().limitFields().pagination()

            //^Execute query
            const tours = await feautures.query;

            return res.status(200).json({
                        status: "success",
                        results: tours.length,
                        data: {
                                    tours
                        }
            })

})

exports.getTour = catchAsync(async (req, res, next) => {

            const tour = await Tour.findById(req.params.id);

            if (!tour) {
                        return next(new AppError('No tour found with that id', 404))
            }

            return res.status(200).json({
                        status: "success",
                        data: {
                                    tour
                        }

            })

})

exports.createTour = catchAsync(async (req, res, next) => {

            const newTour = await Tour.create(req.body);
            return res.status(201).json({
                        status: 'success',
                        data: {
                                    tour: newTour
                        }
            })

})

exports.updateTour = catchAsync(async (req, res, next) => {

            const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
                        new: true,
                        runValidators: true
            })
            if (!tour) {
                        return next(new AppError('No tour found with that id', 404))
            }
            res.status(200).json({
                        status: 'success',
                        data: {
                                    tour
                        }
            })

})

exports.deleteTour = catchAsync(async (req, res, next) => {

            const tour = await Tour.findByIdAndDelete(req.params.id)

            if (!tour) {
                        return next(new AppError('No tour found with that id', 404))
            }

            res.status(200).json({
                        status: 'success',
                        data: null
            })

})

exports.getTourStats = catchAsync(async (req, res, next) => {

            const stats = await Tour.aggregate([
                        {
                                    $match: {
                                                ratingAverage: { $gte: 4.5 }
                                    }
                        }
                        ,
                        {
                                    $group: {
                                                _id: null,
                                                numRatings: { $sum: 'ratingQuantity' },
                                                numTours: { $sum: 1 },
                                                avgRating: { $avg: '$ratingAverage' },
                                                avgPrice: { $avg: '$price' },
                                                minPrice: { $min: '$price' },
                                                maxPrice: { $max: '$price' }

                                    }
                        }


            ])
            res.status(200).json({
                        status: 'success',
                        data: { stats }
            })


})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {

            const year = req.params.year * 1;
            const plan = await Tour.aggregate([
                        {
                                    $unwind: '$startDates'
                        },
                        {
                                    $match: {
                                                startDates: {
                                                            $gte: new Date(`${year}-01-01`),
                                                            $lte: new Date(`${year}-12-31`)
                                                }
                                    }
                        }, {
                                    $group: {
                                                _id: {
                                                            $month: '$startDates'
                                                },
                                                numToursStarts: { $sum: 1 },
                                                tours: { $push: '$name' }
                                    }
                        },
                        {
                                    $addFields: { month: '$_id' }
                        },
                        {
                                    $project: {
                                                _id: 0
                                    }
                        },
                        {
                                    $sort: { numToursStarts: -1 }
                        },
                        {
                                    $limit: 12
                        }
            ])
            res.status(200).json({
                        status: 'success',
                        data: { plan }
            })

});

