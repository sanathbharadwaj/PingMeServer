
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('sendNotification', function(req, res){
	var installationId = req.params.installation;
	var query = new Parse.Query(Parse.installation);
	query.equalTo("installationId", installationId);

	Parse.Push.send({
  	where: query,
  	data: {
  		title : 1,
    	alert: req.params.alertId
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


Parse.Cloud.define('newRequest', function(req, res){
	var userQuery = new Parse.Query(Parse.User);
	userQuery.equalTo("isDriver", true);

	var pushQuery = new Parse.Query(Parse.Installation);
	pushQuery.matchesQuery('user', userQuery);

	Parse.Push.send({
  		where: pushQuery,
  	data: {
    alert: "New request has arrived",
    title: "New Request"
  }
}, {
	useMasterKey: true,

  success: function() {
    // Push was successful
    res.success(1);
  },
  error: function(error) {
    // Handle error
    res.error("Push failed");
  }
});
});
