
const Tour = require("../models/tourModel")
const APIFeautures = require("../utils/apiFeauture");

exports.aliasTopTours = (req, res, next) => {
            req.query.limit = '5';
            req.query.sort = '-ratingsAverage,price';
            req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
            next();
}

exports.getAllTours = async (req, res) => {
            try {

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
            } catch (e) {
                        console.log(e)
                        return res.status(500).json({
                                    status: "fail",
                                    message: e
                        })
            }
}

exports.getTour = async (req, res) => {
            try {
                        const tour = await Tour.findById(req.params.id);
                        return res.status(200).json({
                                    status: "success",
                                    data: {
                                                tour
                                    }

                        })
            } catch (e) {
                        return res.status(404).json({
                                    success: 'fail',
                                    message: e
                        })
            }
}

exports.createTour = async (req, res) => {
            try {
                        const newTour = await Tour.create(req.body);
                        return res.status(201).json({
                                    status: 'success',
                                    data: {
                                                tour: newTour
                                    }
                        })
            } catch (e) {
                        return res.status(400).json({
                                    status: "fail",
                                    message: "Invalid data sent!"
                        })
            }


}

exports.updateTour = async (req, res) => {
            try {
                        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
                                    new: true,
                                    runValidators: true
                        })
                        res.status(200).json({
                                    status: 'success',
                                    data: {
                                                tour
                                    }
                        })
            } catch (e) {
                        return res.status(500).json({
                                    status: "fail",
                                    message: "Invalid data sent!"
                        })
            }
}

exports.deleteTour = async (req, res) => {
            try {
                        const tour = await Tour.findByIdAndDelete(req.params.id)
                        res.status(200).json({
                                    status: 'success',
                                    data: null
                        })
            } catch (e) {
                        return res.status(500).json({
                                    status: "fail",
                                    message: "Invalid data sent!"
                        })
            }
}

exports.getTourStats = async (req, res) => {
            try {
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
            } catch (error) {
                        return res.status(500).json({
                                    status: "fail",
                                    message: error
                        })
            }
}

exports.getMonthlyPlan = async (req, res) => {
            try {
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
            } catch (error) {
                        return res.status(500).json({
                                    status: "fail",
                                    message: error
                        })
            }
}

