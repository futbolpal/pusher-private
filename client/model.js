(function(){
	var model = {
		pusher : null,
	
		/**
		* Called when a channel receives a message 
		**/
		onMessage : function(data){
			$("#log").append(data.message + "<br/>");
		},
		
		/**
		* Called when a channel is connected 
		**/
		onChannelEvent : function(data){
			if(data.public){
				$("#request_public").button("enable");
				$("#info_public").html("Public Pusher channel: " + data.public.name);
			}else{
				$("#request_public").button("disable");
				$("#info_public").html("Public channel not established");
			}
			if(data.private){
				$("#request_private").button("enable");
				$("#info_private").html("Private Pusher channel: " + data.private.name);
			}else{
				$("#request_private").button("disable");
				$("#info_private").html("Private channel not established");
			}
		}
	}
	
	// When the document is ready, prepare the buttons.  
	// Initialize them to disabled, they will be enabled
	// when their respective channel info has been received.
	$(document).ready(function() {		
		model.ppusher = new PusherPrivate();
		model.ppusher.addMessageListener(model);
		model.ppusher.addChannelListener(model);
		model.ppusher.init();
		
		$("#request_private").button({disabled : true}).click(function(){
			model.ppusher.requestPrivateMessage();
		});
		$("#request_public").button({disabled : true}).click(function(){
			model.ppusher.requestPublicMessage();
		});
	});
	
})();