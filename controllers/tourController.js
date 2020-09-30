
const Tour = require("../models/tourModel")


exports.getAllTours = async (req, res) => {
            try {
                        const tours = await Tour.find()
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



