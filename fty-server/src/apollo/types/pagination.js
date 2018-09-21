const {TypeComposer} = require('graphql-compose')

const PaginationInfoTC = TypeComposer.create(`
  # Information about pagination.
  type PaginationInfo {
    # Current page number
    currentPage: Int!
  
    # Number of items per page
    pageSize: Int!
  
    # Total number of pages
    count: Int
  }
`)

module.exports = {
  PaginationInfoTC
}
