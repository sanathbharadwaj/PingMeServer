
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('sendNotification', function(req, res){
	var installationId = req.params.installation;
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
});