<?php

$mylabels = [                                                                                   
    'Not Found',                                                                      
    'noni-gia',                                                                       
    'cdb',                                                                            
    'inmunocal',                                                                      
    'acupuntura',                                                                     
    'cuarzo-lapisázuli'                                                               
];
$values = [ '65', '15', '15', '5', '4', '2' ];

$bar_graph = '

<canvas id = "graph" data-settings=
\'{
"type" : "bar",
"data" : 
{

"labels" : ['.$mylabels.'],
"datasets":
[{
"label":"# cantidad medicina",
"backgroundColor" : "#000000",
"borderColor" : "#000000",
"data": ['.$values.']
}]

},
"options":
{
"legend":
{
"display": true
}
}

}\'
></canvas>';

echo $bar_graph;


?>