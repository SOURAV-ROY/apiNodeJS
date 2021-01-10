const advancedResults = (model, populate) => async (req, res, next) => {

    // try {
    // console.log(req.query);
    let query;

    //Copy req.query ******************************
    const reqQuery = {...req.query};

    //Field to Exclude *****************************
    const removeField = ['select', 'sort', 'page', 'limit'];

    //Loop over removeFields and delete them from reqQuery **********
    removeField.forEach(param => delete reqQuery[param]);

    //Create Query String ************************
    let queryString = JSON.stringify(reqQuery);

    //Create operators ($gt, $gte, $lt, $lte, $in etc)*******
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //Finding Resource ******************************
    query = model.find(JSON.parse(queryString)).populate('courses');

    // const bootcamps = await Bootcamp.find();
    //Select Fields *******************************
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
        console.log(fields);
    }

    //Sort Fields *********************************
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    //Pagination **********************************
    const page = parseInt(req.query.page, 10) || 1;
    // const limit = parseInt(req.query.limit, 10) || 2;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    //Executing Query *****************************
    const results = await query;

    //Pagination Result ****************************
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.advancedResults = {
        success: true,
        total,
        count: results.length,
        pagination,
        data: results
    }

    next();
}

module.exports = advancedResults;