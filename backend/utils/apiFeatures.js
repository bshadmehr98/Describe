/**
 * Filter class for queries
**/
class APIFeatures {
  /**
     * APIFeatures constroctur.
     * @param {object} query The first number.
     * @param {object} querystr The second number.
  **/
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }

  /**
     * Searching in query_set
     * @return {object} The final query set.
  **/
  search() {
    const keyword = this.querystr.keyword ? {
      title: {
        $regex: this.querystr.keyword,
        $options: 'i',
      },
    } : {};
    this.query = this.query.find({...keyword});
    return this;
  }

  /**
     * Filtering query_set
     * @return {object} The final query set.
  **/
  filter() {
    const filters = {};
    for (const prop in this.querystr) {
      if (Object.prototype.hasOwnProperty.call(this.querystr, prop)) {
        const queryParts = prop.split('__');
        if (queryParts.length == 3 && queryParts[0] === 'f') {
          const filterKeyword = `$${queryParts[2]}`;
          filters[queryParts[1]] ={};
          filters[queryParts[1]][filterKeyword] = this.querystr[prop];
        }
      }
    }

    this.query = this.query.find({...filters});
    return this;
  }

  /**
     * Filtering query_set
     * @param {number} resPerPage Current page.
     * @return {object} The final query set.
  **/
  paginate(resPerPage) {
    const currentPage = Number(this.querystr.page) || 1;
    const skip = (currentPage - 1) * resPerPage;

    this.query = this.query.limit(resPerPage).skip(skip);

    return this;
  }
}

module.exports = APIFeatures;
