const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User} = require('../models');
const withAuth = require('../utils/auth');

const path = require("path");
const util = require("util");

// get all posts for dashboard
router.get('/', withAuth, (req, res) => {
  console.log(req.session);
  console.log('======================');
  Post.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      'image'
    ],
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));
      res.render('dashboard', { posts, loggedIn: true });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// After images is uploaded, store Buffer data in Post.image field.
// To render this field, 

router.post('/', withAuth, async (req,res)=>{ 

    try{
        const file = req.files.file;
        console.log(file);
        const fileName = file.name;
        const size = file.data.length;
        const extension = path.extname(fileName);
        const img = file.data.toString('base64');

        const allowedExtensions = /png|jpeg|jpg|gif/;

        if (!allowedExtensions.test(extension)) throw "Unsupported extension!";
        if (size > 5000000) throw "File must be less than 5MB";


        //const md5 = file.md5;
        //const URL = "/uploads/" + md5 + extension;

       // await util.promisify(file.mv)("./public" + URL);
      

        Post.create({
          title: req.body.username,
          // image: file.data
          post_url: req.body.description,
          user_id: req.session.user_id,
          image:img
        })
          .then(dbPostData => res.json(dbPostData))
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
        
        }
        catch(err){
          console.log(err);
          res.status(500).json({
              message: err,
          })
      }
      res.redirect('/dashboard')
});


router.delete('/:id', withAuth, (req, res) => {
  console.log('id', req.params.id);
  Post.destroy({
    where: {
      id: id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});



module.exports = router;
