const Section = require('../models/section');
const Page = require('../models/page');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Getting page sections
exports.getSection = catchAsyncErrors(async (req, res, next) => {
  const page = await Page.findById(req.params.pageId);
  if (!page) {
    return next(new ErrorHandler('Page not found', 404));
  }
  if (page.user != req.user.id) {
    return next(new ErrorHandler(ERROR_MESSAGES.PAGE_NOT_FOUND, 404));
  }

  const section = await Section.findOneAndUpdate(
      {page: page.id},
      {page: page.id},
      {upsert: true, new: true, setDefaultsOnInsert: true});
  res.status(200).json({
    success: true,
    section: section,
  });
});


// Updating page section
exports.updatePage = catchAsyncErrors(async (req, res, next) => {
  const page = await Page.findById(req.params.pageId);
  if (!page) {
    return next(new ErrorHandler('Page not found', 404));
  }
  if (page.user != req.user.id) {
    return next(new ErrorHandler(ERROR_MESSAGES.PAGE_NOT_FOUND, 404));
  }

  section = await Section.findOneAndUpdate({page: page.id}, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    section: section,
  });
});
