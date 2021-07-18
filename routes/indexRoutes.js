const express = require('express');
const ejs = require('ejs');

const indexRoutes = express.Router();
const view_path = 'views';

indexRoutes.get('/', (req, res) => {
  ejs.renderFile(`${view_path}/index.ejs`, {
    message: 'Hello World'
  },
    {}, function (err, template) {
      if (err) throw err;
      res.end(template);
    }
  )
});


module.exports = indexRoutes;