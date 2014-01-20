// Code based on http://addyosmani.com/largescalejavascript/ And the design
// patterns book
// http://addyosmani.com/resources/essentialjsdesignpatterns/book/#designpatternsjavascript

var mediator = (function() {
  var subscribe = function(channel, fn){
    if (!mediator.channels[channel]) {
      mediator.channels[channel] = [];
    }
    mediator.channels[channel].push({ context: this, callback: fn });
    return this;
  };

  var publish = function(channel){
    if (!mediator.channels[channel]) return false;
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0, l = mediator.channels[channel].length; i < l; i++) {
      var subscription = mediator.channels[channel][i];
      subscription.callback.apply(subscription.context, args);
    }
    return this;
  };

  return {
    channels: {},
    publish: publish,
    subscribe: subscribe,
    installTo: function(obj) {
      obj.subscribe = subscribe;
      obj.publish = publish;
    }
  };
}());

var github = (function() {
  var httpRequest = new XMLHttpRequest();
  var publishAjaxCompleted = function() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
      mediator.publish('refreshUser', JSON.parse(httpRequest.responseText));
    }
  };

  var getUser = function (user) {
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = publishAjaxCompleted;
    httpRequest.open('GET', 'https://api.github.com/users/' + user);
    httpRequest.send();
  };

  return {
    getUser: getUser
  };

}());

var ui = (function() {
  var refresh = function(data) {
    updatableArea = document.querySelector('#updatableArea');
    updatableArea.innerHTML = data.login;
    updatableArea.innerHTML += "<img src='"+data.avatar_url+"'>";
  };
  return {
    user: {
      refresh: refresh
    }
  }
}());


window.onload = function() {
  //Pub/sub on a centralized mediator
  mediator.subscribe('refreshUser', ui.user.refresh);

  mediator.subscribe('updateClick', github.getUser);

  updateButton = document.querySelector('#updateButton');
  updateButton.addEventListener('click', function() {
    userName = document.querySelector('#githubUser').value;
    mediator.publish('updateClick', userName);
  });
};

