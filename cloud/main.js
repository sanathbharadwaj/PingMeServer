
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('sendNotification', function(req, res){
	var userId = req.params.userId;
	var firebaseUser = Parse.Object.extend("FirebaseUser");
	var query = new Parse.Query(firebaseUser);
	query.equalTo("userId",userId);
	query.limit(1);
	query.find({
		 success: function(results) {
    // Do something with the returned Parse.Object values
    var object = results[0];
    var id = object.get("insId");
    pushNotification(id, req);
  },
  error: function(error) {
    res.error(0);
  }
	});


function pushNotification(installationId, req){
	var query = new Parse.Query(Parse.Installation);
	query.equalTo("installationId", installationId);
	console.log("My alert:" + req.params.title);
	Parse.Push.send({
  	where: query,
  	data: {
  		title : req.params.title,
    	alert: req.params.message
  		}
}, {
	useMasterKey: true,

  success: function() {
    // Push was successful
    res.success(1);
  },
  error: function(error) {
    // Handle error
    res.error(0);
  }
});
}
});

Parse.Cloud.define('tripStartedNotification', function(req, res){
  var userIds = req.params.userIds;
  var firebaseUser = Parse.Object.extend("FirebaseUser");
  var query = new Parse.Query(firebaseUser);
  query.containedIn("userId",userIds);
  query.find({
     success: function(results) {
    //var id = object.get("insId");
    pushNotification(results);
  },
  error: function(error) {
    res.error(0);
  }
  });


function pushNotification(results){
  var insIds = [];
  for (var i = results.length - 1; i >= 0; i--) {
    insIds[i] = results[i].get("insId");
  }
  var driverId  = req.params.extras[0];
  var query = new Parse.Query(Parse.Installation);
  query.containedIn("installationId", insIds);
  Parse.Push.send({
    where: query,
    data: {
      title : "beginTrip",
      alert: driverId
      }
}, {
  useMasterKey: true,

  success: function() {
    // Push was successful
    res.success(1);
  },
  error: function(error) {
    // Handle error
    res.error(0);
  }
});
}
});


Parse.Cloud.define('notificationToAll', function(req, res){
	var query = new Parse.Query(Parse.Installation);
	//query.equalTo("installationId", installationId);
	//console.log("My alert:" + req.params.name);
	Parse.Push.send({
  	where: query,
  	data: {
  		title : req.params.title,
    	alert: req.params.message
  		}
}, {
	useMasterKey: true,

  success: function() {
    // Push was successful
    res.success(1);
  },
  error: function(error) {
    // Handle error
    res.error("Failed to send the push");
  }
});
});