/* eslint-disable no-console */
const AWS = require('aws-sdk');
const uuid = require('uuid');

const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
});
module.exports = (app) => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 'demo-blog-bucket',
        ContentType: 'image/jpeg',
        Key: key,
      },
      (err, url) => {
        if (err) {
          console.log('Server error', err);
        }
        res.send({ key, url });
      },
    );
  });
};
