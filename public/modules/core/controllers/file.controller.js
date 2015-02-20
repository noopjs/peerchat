angular.module('core').controller('FileController', ['Peer', function(){
    this.file = { };
    this.upload = function(){
        peer.send(this.file);
        console.log('File Sent');
        return;
    };

}]);