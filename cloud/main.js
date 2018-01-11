
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
    pushNotification(id);
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
	});


function pushNotification(installationId){
	var query = new Parse.Query(Parse.Installation);
	query.equalTo("installationId", installationId);

	Parse.Push.send({
  	where: query,
  	data: {
  		title : "New Ping",
    	alert: req.params.mobileNo
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
}
});