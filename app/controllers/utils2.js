/**
 * Created by GB115151 on 18/07/2016.
 */
'use strict'

exports.filterForRelevance = function(logs, person1, person2){

    var testLogRelevance = function(){
        var args = Array.prototype.slice.call(arguments);
        //console.log("args: " + args + '\n' + '-------');
        var oneWay = function(){
            return (log.instigator.id === person1.id && log.target.id === person2.id);
        };
        var inverseWay = function(){
            return (log.target.id === person1.id && log.instigator.id === person2.id);
        };
        if (args.length === 3){
            var log = args[2];
            var person1 = args[0];
            var person2 = args[1];
            return (oneWay()|| inverseWay())
        }else if (args.length ===2 ){
            return (args[1].instigator.id === args[0].id || args[1].target.id === args[0].id)
        }
    };

    if (logs.length === 0) {return []}
    var result = logs.filter(function(log){
        var args  = [];
        args.push(person1);
        if (person2){args.push(person2)}
        args.push(log);
        return testLogRelevance.apply(null, args);
    });
    return result;

};

exports.hideNames = function(logs, userObj){
    logs
        .map(function(log){
            //console.log("log: " + JSON.stringify(log));
            if ((userObj.friends.indexOf(log.instigator.id) === -1
                && log.instigator.id !== userObj.id)){
                log.instigator.username = 'mystery';
                log.instigator.firstName = 'mystery';
                log.instigator.lastName = 'mystery';
                log.instigator.displayName = 'mystery';
            }
            if ((userObj.friends.indexOf(log.target.id) === -1
                && log.target.id !== userObj.id)){
                log.instigator.username = 'mystery';
                log.instigator.firstName = 'mystery';
                log.instigator.lastName = 'mystery';
                log.instigator.displayName = 'mystery';
            }
        });
    return logs;
};

