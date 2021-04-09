const path = require('path')
const fs = require('fs')

const Users = require('../models/users')
const PaginationHelper = require('../helpers/pagination')

exports.list = (req, res) => {
  let users = Users.find()

  // Get the pagination data
  const pagination = PaginationHelper.getPagination(users, req.query.page)

  // Get a slice of the data to display
  users = PaginationHelper.getDataByPage(users, pagination.pageNumber)

  res.render('../views/users/index', {
    users,
    pagination
  })
}
