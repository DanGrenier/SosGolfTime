// Code goes here

var API_ENDPOINT = "https://4y5esvon09.execute-api.us-east-1.amazonaws.com/prod/test"
var trou_depart;
var trou;

$(document).ready(function(){ 

$('[data-toggle="tooltip"]').tooltip();



//Quand on clique calculer
$("#calc").click(function(){
  $("#btn_details").text("Show Details");
  $("#tableau tbody").empty();
  $("#resultats").empty();
  $('#details').hide();
  $("#bouton").hide();



  //On obtient le trou de depart
  trou_depart = $("#trou_depart").val();

  //On obtient quel trou l'usager a choisi
  trou = $("#trous").val();

  //On obtient leur temps de depart
  var timestring = $("#timepicker").val();

  var currentDate = moment().tz("America/New_York");
  currentDate.year(2018);
  currentDate.month(0);
  currentDate.date(1);

  //On le converti en heure avec la bonne timezone
  var started_at = moment.tz('2018-01-01 '+timestring, "America/New_York");

  $.ajax({
    url: API_ENDPOINT,
    type: 'GET',
    data:{
      lang: "EN",
      heure_depart: started_at.format(),
      heure_courante: currentDate.format(),
      trou_depart: trou_depart,
      trou_actuel: trou
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

function displayResults(response)
{
  //Ici on va populer le detail
  var laclass;
  var letrou;
  var parcoursFinal = response.rtn_parcour_final;
  var targetTimes = response.rtn_target_times;

  var realTrou = 0;
  if (trou_depart > trou)
    realTrou = 18 - trou_depart + trou +1;
  else
    realTrou = trou - trou_depart + 1;

  $("#resultats").html(response.rtn_text);


  for(var j=0;j<=18;j++){
    if (j === 0)
      letrou = "Started";
    else
      letrou = parcoursFinal[j];
    
    var lheure = moment(targetTimes[j]).format("HH:mm");
    if (realTrou == j){
      laclass = "bg-success";
      }
    else
    {
      laclass = "";
    }
    var markup = "<tr><td align='center' class ='"+laclass+"'>"+letrou+"</td><td align='center' class ='"+laclass+"'>"+lheure+"</td></tr>";
    $("#tableau tbody").append(markup);
  }


  $("#bouton").show();

}

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




