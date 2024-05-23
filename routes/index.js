var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require('passport');
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
const uplaod = require("./multer");

/* GET home page. */

// router.get('/alluserposts', async function(req, res, next) {
//   let user = await userModel.findOne({_id: "65e56bd015a445a5b1d8673d"})
//   .populate('posts');
//   res.send(user);
// });

// router.get('/createuser', async function(req, res, next) {
//   let createduser = await userModel.create({
//     username: "Yankit",
//     password: "Yankit",
//     posts: [],
//     email: "yankit@mail.com",
//     fullName: "Yankit Rajor"
//   })
//   res.send(createduser);
// });

// router.get('/createpost', async function(req, res, next) {
//   let createdpost = await postModel.create({
//     postText: "Kaise ho saare",
//     user: "65e56bd015a445a5b1d8673d"
//   });
//   let user = await userModel.findOne({_id: "65e56bd015a445a5b1d8673d"});
//   user.posts.push(createdpost._id);
//   await user.save();
//   res.send("Done");
// });


router.get('/', function(req, res, next) {
  res.render('index');
});

router.get("/login", function(req, res, next) {
  // console.log(req.flash('error'));
  res.render("login", {error: req.flash('error')});
});

router.get("/feed", function(req, res, next) {
  res.render("feed");
});

router.get("/profile", isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts");
  console.log(user);
  res.render("profile", {user});
});

router.post("/register", function(req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password)
  .then(function() {
    passport.authenticate("local")(req, res, function() {
      res.redirect("/profile");
    })
  })
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}) , function(req, res) {});


router.get("/logout", function(req, res) {
  req.logOut(function(err) {
    if(err) {return next(err); }
    res.redirect('/');
  });
});

router.post("/upload", isLoggedIn, uplaod.single('file'), async function(req, res, next) {
  if(!req.file){
    return res.status(404).send("No files were given");
  }
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
