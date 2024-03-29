const User = require('../models/User')

exports.mustBeLoggedIn = function(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    req.flash("errors", "You must be logged in to perform that action.")
    req.session.save(function() {
      res.redirect('/')
    })
  }
}

exports.login = function(req, res) {
  let user = new User(req.body)
  user.login().then(function(result) {
    req.session.user = {avatar: user.avatar, username: user.data.username, _id: user.data._id}        //res.send(result)
    req.session.save(function() {
      res.redirect('/')
    })
  }).catch(function(e) { //ved fejl-logi        //res.send(e) //besked
    req.flash('errors', e)
    req.session.save(function() {
      res.redirect('/')
    })
  })
}   

exports.logout = function(req, res) {   
  req.session.destroy(function() {
    res.redirect('/')
  })    //res.send("You are now logged out.")
}

exports.register = function(req, res) {
  let user = new User(req.body)
  user.register().then(() => {
    req.session.user = {username: user.data.username, avatar: user.avatar, _id: user.data._id}
    req.session.save(function() {
      res.redirect('/')
    })
  }).catch((regErrors) => {
    regErrors.forEach(function(error) {
      req.flash('regErrors', error)
    })
    req.session.save(function() {
      res.redirect('/')
    }) 
  })
}

exports.home = function(req, res) {
  if (req.session.user) {       // res.send("Welcome to the actual application!")
    res.render('home-dashboard')
  } else {    //guest template
    res.render('home-guest', {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
} 