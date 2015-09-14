var express = require('express');
var router = express.Router();

var db = require('monk') ('localhost/jobsly');
var jobs = db.get('jobs');

/* GET home page. */
router.get('/', function(req, res, next) {
  jobs.find({}, function(err, docs){
    res.render('index', { jobs: docs});
  });
});

router.get('/jobs/newJobs', function(req, res, next){
  res.render('newJobs');
});

router.post('/', function(req, res, next){
  if(!req.body.jobs){
    res.render('newJobs', {newJobError: "Please input job info"});
  } else {
    req.body.applicants = [];
    jobs.insert(req.body);
    console.log(req.body);
      res.redirect('/');
  }
});

router.get('/jobs/:id', function(req, res, next){
  jobs.findOne({_id: req.params.id}, function(err, doc){
    res.render('showJob', {jobs: doc});
  });
});

router.get('/jobs/:id/editJob', function(req, res, next){
  jobs.findOne({_id: req.params.id}, function(err, doc){
    res.render('editJob', doc);
  });
});

router.post('/jobs/:id/applicants', function(req, res, next){
  jobs.findOne({_id: req.params.id}, function(err, doc){
    doc.applicants.push(req.body);
    jobs.update({_id: req.params.id}, doc, function(err, doc){
      res.redirect('/');
    });
  });
});

router.post('/jobs/:id/applicants/delete', function(req, res, next){
  jobs.findOne({_id: req.params.id}, function(err, doc){
    var index = doc.applicants.indexOf(req.body.applicant);
    doc.applicants.splice(index, 1);
    jobs.update({_id: req.params.id}, doc, function(err, doc){
      res.redirect('/jobs/' + req.params.id);
    });
  });
});

router.post('/jobs/:id/update', function(req, res, next){
  jobs.update({_id: req.params.id}, req.body, function(err, doc){
    res.redirect('/');
  });
});

router.post('/jobs/:id/delete', function(req, res, next){
  jobs.remove({_id: req.params.id}, function(err, doc){
    res.redirect('/');
  });
});

module.exports = router;
