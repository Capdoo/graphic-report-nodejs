clase = 0;

$(document).ready( async function(){

    await tipo_grafica();

    console.log("este es mi tipo ", clase);

    switch(clase){
        case '1':
            barrasGrafico();
            break;
        case '2':
            console.log("Entra al 2")
            pieGrafico();
            break;
        case 3:

        case 4:

        case 5:

    }
    
});


const tipo_grafica = async () => {
    await $.ajax({
        url: '/graficas/tipo-grafica',
        type: 'GET',
        datatype: 'json',
        success: (response) => {

            if(response !== null){
                console.log(response) 
                clase = response;
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}



const barrasGrafico = async () =>{

    labels = [];
    values = [];

    await $.ajax({
        url: '/graficas/send',
        type: 'GET',
        datatype: 'json',
        success: (response) => {

            if(response !== null){
                console.log(response) 

                console.log(response[0]) 

                for(x of response){
                    labels.push(x.medicamento)
                    values.push(x.numero)
                }
            }
        },
        error: (err) => {
            console.log(err);
        }
    });

    var ctx = document.getElementById('miGrafico').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            // labels: ['Hola', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            labels: labels,
            datasets: [{
                label: 'Cantidad medicina',
                // data: [parseInt(values[0],8), 19, 3, 5, 2, 3],
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


}


const pieGrafico = async () =>{


    labels = [];
    values = [];

    await $.ajax({
        url: '/graficas/send',
        type: 'GET',
        datatype: 'json',
        success: (response) => {

            if(response !== null){
                console.log(response) 

                console.log(response[0]) 

                for(x of response){
                    labels.push(x.hsueno)
                    values.push(x.cantidad)
                }
            }
        },
        error: (err) => {
            console.log(err);
        }
    });

    var ctx = document.getElementById('miGrafico').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: '# of Votes',
                // data: [parseInt(values[0],8), 19, 3, 5, 2, 3],
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Horas de sueño pacientes con migraña'
              }
            }
          }
    });


}


