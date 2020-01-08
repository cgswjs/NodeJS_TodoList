//Wrap the get date js code into a function
//export getDate out
//ths makes getDate be able to be called by other files

//one can export multiple functions from a file
//using object oriented programming
//example: module.exports.getDate = getDate
//module.exports.getDay = getDay
//in nodejs exports is the same as module.exports
exports.getDate = function(){
  let today = new Date();

  let options = {
    weekday:"long",
    day:"numeric",
    month:"long"
  };
  return today.toLocaleDateString("en-US",options);
}
