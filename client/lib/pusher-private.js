(function(){
	var PusherPrivate = function(){
		this._constructDefaults();
	}
	
	PusherPrivate.prototype._constructDefaults = function(){
		this.pusher = new Pusher("ea4e88ebf3b60b6d309f");
		this.channels  = {public : null , private : null};
		this.socket = io.connect();
		this.messageListeners = [];
		this.channelListeners = [];
	}
	
	PusherPrivate.prototype.init = function(){	
		/**
		* 1.  Receive Pusher channel information from the server
		* 2.  On receive of channel information, bind Pusher channel
		*		to listen for 'event' events from the Pusher server
		* 3.  Once the channel information is received, activate
		*		the client button so the user can request a channel
		*		on each particular channel
		**/
		var $this = this;
		
		//Listen for a channel-public message on connection time
		//from the server
		this.socket.on('channel-public', function (data) {
			$this.channels.public = {};
			$this.channels.public.name = data.channel;
			$this.channels.public.channel = $this.pusher.subscribe($this.channels.public.name);
			$this.channels.public.channel.bind('event',function(msg){
				msg.channel = $this.channels.public;
				$this._notifyMessageListeners(msg);
			});
			$this._notifyChannelListeners($this.channels);
		});


		//Listen for a channel-private message on connection time
		//from the server
		this.socket.on('channel-private', function(data){
			$this.channels.private = {};
			$this.channels.private.name = data.channel;
			$this.channels.private.channel = $this.pusher.subscribe($this.channels.private.name);
			$this.channels.private.channel.bind('event',function(msg){
				msg.channel = $this.channels.private;
				$this._notifyMessageListeners(msg);
			});
			$this._notifyChannelListeners($this.channels);
		});
	}
	
	/**
	* This function adds a channel listener.  A channel listener must implement
	* a onChannelEvent function
	**/
	PusherPrivate.prototype.addChannelListener = function(listener){
		if(listener && typeof listener.onChannelEvent === "function"){
			this.channelListeners.push(listener);
		}
	}
	
	/**
	* This function adds a message listener.  A message listener must implement
	* the onMessage function
	**/	
	PusherPrivate.prototype.addMessageListener = function(listener){
		if(listener && typeof listener.onMessage === "function"){
			this.messageListeners.push(listener);
		}
	}
	
	
	/**
	* This function requests a private message
	**/
	PusherPrivate.prototype.requestPrivateMessage = function(){
		this.socket.emit('trigger-private');
	}	
	
	/**
	* This function requests a public message
	**/
	PusherPrivate.prototype.requestPublicMessage = function(){
		this.socket.emit('trigger-public');
	}
	
	/**
	* This function notifies all channel listeners that a channel has connected
	**/
	PusherPrivate.prototype._notifyChannelListeners = function(data){
		for(var i in this.channelListeners){
			var listener = this.channelListeners[i];
			listener.onChannelEvent(data);
		}
	}
	
	/**
	* This function notifies all message listeners that a message was received.
	**/
	PusherPrivate.prototype._notifyMessageListeners = function(data){
		for(var i in this.messageListeners){
			var listener = this.messageListeners[i];
			listener.onMessage(data);
		}
	}
	
	window.PusherPrivate = PusherPrivate;
})();