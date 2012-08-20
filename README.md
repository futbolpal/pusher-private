pusher-private
==============

This demonstrates added functionality to send private messages to a single client using Pusher

# pusher-private.js

This portable library allows your web application to accept private messages sent only to you as a client and not publicly distributed to all subscribed clients.

Public functions

	/**
	* 
	**/
	PusherPrivate.prototype.init;
	
	/**
	* This function adds a channel listener.  A channel listener must implement
	* a onChannelEvent function
	**/
	PusherPrivate.prototype.addChannelListener;
	
	/**
	* This function adds a message listener.  A message listener must implement
	* the onMessage function
	**/	
	PusherPrivate.prototype.addMessageListener;
	
	
	/**
	* This function requests a private message
	**/
	PusherPrivate.prototype.requestPrivateMessage;
	
	/**
	* This function requests a public message
	**/
	PusherPrivate.prototype.requestPublicMessage;
	
#Example

	(function(){
		var model = {
			pusher : null,
		
			/**
			* Called when a channel receives a message 
			**/
			onMessage : function(data){
			},
			
			/**
			* Called when a channel is connected 
			**/
			onChannelEvent : function(data){
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