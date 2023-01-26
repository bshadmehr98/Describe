const Page = require('../models/page');
const ErrorHandler = require('../utils/errorHandler');
const {ERROR_MESSAGES, DELETED_MESSAGES} = require('../utils/messages');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');

// Getting all pages
exports.getPages = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 10;

  let apiFeatures = new APIFeatures(Page.find(), req.query);
  const pagesCount = await Page.countDocuments();
  const currentCount = await apiFeatures
      .search()
      .filter()
      .query.clone()
      .count();
  apiFeatures = apiFeatures.search().filter().paginate(resPerPage);
  const pages = await apiFeatures.query;
  res.status(200).json({
    success: true,
    pages: pages,
    count: currentCount,
    total: pagesCount,
  });
});

// Getting single product
exports.getPage = catchAsyncErrors(async (req, res, next) => {
  const page = await Page.findById(req.params.id);
  if (!page) {
    return next(new ErrorHandler(ERROR_MESSAGES.PAGE_NOT_FOUND, 404));
  }
  if (page.user != req.user.id) {
    return next(new ErrorHandler(ERROR_MESSAGES.PAGE_NOT_FOUND, 404));
  }
  res.status(200).json({
    success: true,
    page: page,
  });
});

// Updating single product
exports.updatePage = catchAsyncErrors(async (req, res, next) => {
  let page = await Page.findById(req.params.id);
  if (!page) {
    return next(new ErrorHandler(ERROR_MESSAGES.PAGE_NOT_FOUND, 404));
  }
  if (page.user != req.user.id) {
    return next(new ErrorHandler(ERROR_MESSAGES.PAGE_NOT_FOUND, 404));
  }

  page = await Page.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    page: page,
  });
});

// Deleting single product
exports.deletePage = catchAsyncErrors(async (req, res, next) => {
  let page = await Page.findById(req.params.id);
  if (!page) {
    return next(new ErrorHandler(ERROR_MESSAGES.PAGE_NOT_FOUND, 404));
  }
  if (page.user != req.user.id) {
    return next(new ErrorHandler(ERROR_MESSAGES.PAGE_NOT_FOUND, 404));
  }

  page = await page.remove();

  res.status(200).json({
    success: true,
    message: DELETED_MESSAGES.PAGE_DELETED,
  });
});

// Creating new product
exports.newPage = catchAsyncErrors( async (req, res, next) => {
  req.body.user = req.user.id;
  console.log(req.body);
  const page = await Page.create(req.body);
  res.status(201).json({
    success: true,
    page: page,
  });
});
