// Code based on http://addyosmani.com/largescalejavascript/
// And the design patterns book http://addyosmani.com/resources/essentialjsdesignpatterns/book/#designpatternsjavascript

var mediator = (function(){
  var subscribe = function(channel, fn){
    if (!mediator.channels[channel]) {
      mediator.channels[channel] = [];
    }
    mediator.channels[channel].push({ context: this, callback: fn });
    return this;
  },

  publish = function(channel){
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

window.onload = function() {
  //Pub/sub on a centralized mediator
  mediator.name = 'update';
  mediator.subscribe('update', function(arg){
    updatableArea = document.querySelector('#updatableArea');
    updatableArea.innerHTML = '<p>Ei eu fui atualizado'+ arg+ '</p>';
  });

  updateButton = document.querySelector('#updateButton');
  updateButton.addEventListener('click', function() {
    mediator.publish('update', 'yahoo');
  });
};

