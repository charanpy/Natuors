
const Tour = require("../models/tourModel")


exports.getAllTours = async (req, res) => {
            try {
                        //~Filtering

                        const queryObj = { ...req.query };
                        const excludedFields = ['page', 'sort', 'limit', 'fields'];
                        excludedFields.forEach(el => delete queryObj[el])
                        console.log(queryObj);
                        //~Advanced filtering
                        let queryStr = JSON.stringify(queryObj);
                        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);


                        //^Build query
                        let query = Tour.find(JSON.parse(queryStr));

                        //~Sorting

                        if (req.query.sort) {
                                    const sortBy = req.query.sort.split(',').join(' ')
                                    query = query.sort(sortBy)
                        } else {
                                    query = query.sort('-createdAt');
                        }

                        //~Field limiting

                        if (req.query.fields) {
                                    const fields = req.query.fields.split(',').join(' ');
                                    query = query.select(fields);
                        } else {
                                    query = query.select('-__v');
                        }

                        //~Pagination

                        const page = req.query.page * 1 || 1;
                        const limit = req.query.limit * 1 || 100;
                        const skip = (page - 1) * limit;

                        query = query.skip(skip).limit(limit);


                        //*Execute query
                        const tours = await query;



                        return res.status(200).json({
                                    status: "success",
                                    results: tours.length,
                                    data: {
                                                tours
                                    }
                        })
            } catch (e) {
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



