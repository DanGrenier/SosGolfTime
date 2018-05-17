// Global Variables
var API_ENDPOINT = "https://4y5esvon09.execute-api.us-east-1.amazonaws.com/prod/test"
var start_hole;
var current_hole;

$(document).ready(function(){ 

//Tooltip enabled
$('[data-toggle="tooltip"]').tooltip();


//When the Calc Buton is Clicked
$("#calc").click(function(){
  //Clear the sections and buttons
  $("#btn_details").text("Show Details");
  $("#result_table tbody").empty();
  $("#results").empty();
  $('#details').hide();
  $("#btn").hide();


  //Get starting hole
  start_hole = $("#starting_hole").val();

  //Get current hole
  current_hole = $("#holes").val();

  //Get starting time
  var timestring = $("#timepicker").val();

  //Compute current time
  var currentDate = moment().tz("America/New_York");
  currentDate.year(2018);
  currentDate.month(0);
  currentDate.date(1);

  //Convert times as the same timezone for calculation purposes
  var started_at = moment.tz('2018-01-01 '+timestring, "America/New_York");

  //Call the AWS API Gateway that relays the information to the AWS Lambda function
  //that calculates your playing time and returns the proper information
  $.ajax({
    url: API_ENDPOINT,
    type: 'GET',
    data:{
      lang: "EN",
      start_time: started_at.format(),
      current_time: currentDate.format(),
      start_hole: start_hole,
      current_hole: current_hole
      },
      success: function (response) {
        displayResults(response);
      },
      error: function(xhr,status,error)    {
        var err = JSON.parse(xhr,responseText);
        alert(err.message);
      }

  });

});

//Function that will handle the display of result from the API call
function displayResults(response)
{
  //grab the items from the response
  var the_class;
  var the_hole;
  var finalOrder = response.rtn_final_order
  var targetTimes = response.rtn_target_times;

  //Compute the "real" hole (of the array) based on where the player started
  var realHole = 0;
  if (start_hole > current_hole)
    realHole = 18 - start_hole + current_hole +1;
  else
    realHole = current_hole - start_hole + 1;

  //Display the proper text (Ahead, Late, On Time) from API reponse
  $("#results").html(response.rtn_text);

  //Populate the table that shows the end time at every hole
  for(var j=0;j<=18;j++){
    if (j === 0)
      the_hole = "Started";
    else
      the_hole = finalOrder[j];
    
    var the_time = moment(targetTimes[j]).format("HH:mm");
    if (realHole == j)
      the_class = "bg-success";
    else
      the_class = "";
    
    var markup = "<tr><td align='center' class ='"+the_class+"'>"+the_hole+"</td><td align='center' class ='"+the_class+"'>"+the_time+"</td></tr>";
    $("#result_table tbody").append(markup);
  }

  $("#btn").show();
}

//If the show detail is clicked, we show or hide details
$("#btn_details").click(function(){
  if($(this).text() == "Hide Details")
  {
   $(this).text("Show Details");
  }
  else
  {
   $(this).text("Hide Details"); 
  }  
  
  $('#details').toggle();
  return false;
});

});




