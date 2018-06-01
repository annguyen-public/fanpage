var express = require('express');
var app = express();
const db_name = 'nine_db';
var http = require('http');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://nineuser:123@ds133550.mlab.com:33550/" + db_name;

var graph = require('fbgraph');

graph.setAccessToken('EAAb1ZCcr4CtcBAGo3Wht4L1qB4NgjrWMfuF5cpLGYw2cf0mHaobimS4dp6Mju7Est9xgWWVp0OS1JhMAIVILcUhgkk6SD6U6ZAbSSzZAap77F11PHyMZBJzGtOrv05PQ0zwD3ZBAk0zRP2vPC1puayUulvbyFRKBCceRLY82e1ZA1UsLj9QA0k');

var i = 0;

function getCollectionHottest(collection, skip, count) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(db_name);

      var query = {type : "Image"};

      var mysort = { upVoteCount: -1 };
      if(collection == 'intagram'){
        mysort = { like_count: -1 };
      }

      dbo.collection(collection).find(query).limit(count).skip(skip).sort(mysort).toArray(function(err, result) {
        if (err)
          reject(err);
        else
          resolve(result);
        db.close();
      });
    });
  }); 
}

function getRandomNum(){
	var date = new Date();	
	var hour = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();

	var randomNum = hour + min + sec;
	return randomNum%20;
}

app.get('/updateFanPage', function (req, res) {
	getCollectionHottest('kpop', getRandomNum(), 1).then(function(result) {
		var data = {
			'message' : result[0].title,
			'url' : result[0].content
		}
		graph.post('464220820690513/photos', data, function(err, res) {
			console.log(res);
		});
	}, function(err) {
	    console.log(err);
	});

	/*graph.post('464220820690513/photos', data, function(err, res) {
		console.log(res);
	});*/
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});
