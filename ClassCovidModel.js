var desk = [];
let desks = [];
let student = [];
let students = [];
let studentCenters = [];
let deskHeight = 35.75 / 12;
let deskWidth = 22.75 / 12;
let studentHeight = (35.75 - 18) / 12;
let studentWidth = deskWidth;
//Determines accuracy, higher point number means longer time to calculate, but also less chance of missing someone who should quarantine. 20 points is easily enough however.
let pointsNumber = 20;
let studentsRequiredToQuarantine = 0;
let covidCases = 0;
let totalStudents = 0;
let studentDeskPlacedNumbers = [];
let percentDone = 0;
// Bottom horizontal line
for (let i = 0; i < pointsNumber + 1; i++) {
    let dump = {};
    dump.x = 0 + i * (deskWidth / pointsNumber);
    dump.y = deskHeight - studentHeight;
    desk.push(dump);
    let dump2 = {};
    dump2.x = 0 + i * (studentWidth / pointsNumber);
    dump2.y = 0;
    student.push(dump2);

};
//Top horizontal line
for (let i = 0; i < pointsNumber + 1; i++) {
    let dump = {};
    dump.x = deskWidth - i * (deskWidth / pointsNumber);
    dump.y = deskHeight;
    desk.push(dump);
    let dump2 = {};
    dump2.x = studentWidth - i * (studentWidth / pointsNumber);
    dump2.y = studentHeight;
    student.push(dump2);


};
//Left vertical line
for (let i = 0; i < pointsNumber + 1; i++) {
    let dump = {};
    dump.x = 0;
    dump.y = deskHeight - i * (studentHeight / pointsNumber);
    desk.push(dump);
    let dump2 = {};
    dump2.x = 0;
    dump2.y = studentHeight - i * (studentHeight / pointsNumber);
    student.push(dump2);


};
//Right vertical line
for (let i = 0; i < pointsNumber + 1; i++) {
    let dump = {};
    dump.x = deskWidth;
    dump.y = deskHeight - studentHeight + i * (studentHeight / pointsNumber);
    desk.push(dump);
    let dump2 = {};
    dump2.x = studentWidth;
    dump2.y = 0 + i * (studentHeight / pointsNumber);
    student.push(dump2);


};
//Code to make 30 desks
for (let g = 0; g < 30; g++) {
    let horizontalDistanceApart = 2;
    let verticalDistanceApart = 1;
    //verticalDistanceApart not used because desks are back to back in class chosen
    let shiftX = 3 + (horizontalDistanceApart + deskWidth) * (g % 6);
    let shiftY = 1 + Math.floor(g / 6) * (deskHeight);
    let deskCoordinates = [];
    let studentCoordinates = [];
    //Determines center of circle to represent student
    let dump5 = {};
    dump5.x = shiftX + (deskWidth / 2.2);
    dump5.y = shiftY + (deskHeight / 2);
    studentCenters.push(dump5);
    //Makes a copy of each template student and desk, and puts them at the spot specified by shiftX and shiftY
    for (let i = 0; i < desk.length; i++) {
        let dump2 = {};
        dump2.name = g;
        dump2.type = "d";
        dump2.hasStudent = true;
        dump2.x = desk[i].x + shiftX;
        dump2.y = desk[i].y + shiftY;
        deskCoordinates.push(dump2);
        let dump4 = {};
        dump4.name = g;
        dump4.type = "s";
        dump4.x = student[i].x + shiftX;
        dump4.y = student[i].y + shiftY;
        studentCoordinates.push(dump4);
    }
    desks.push(deskCoordinates);

    students.push(studentCoordinates);

}
//Used to plot the teacher
let teacherPoints = [];
for (let i = 0; i < desk.length; i++) {
    let dump4 = {};
    dump4.name = 30;
    dump4.type = "d";
    dump4.x = 0.6 * student[i].x + 12.9;
    dump4.y = 0.6 * student[i].y + 17.5;
    teacherPoints.push(dump4);
}

//Coordinates to draw shapes

let pathCoordinates = desks.map(element => element);



// 27 by 20 room, room is bigger, but cut off parts where no students are seated
var width = 270;
var height = 200;
//Make svg for everything to be plotted on
const svg = d3.select("#SVG")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height)
    .classed("svg-content", true);
//Makes background for graphic
svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height);
//Converts coordinates to scales    
const xScale = d3.scaleLinear()
    .domain([0, 27])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, 20])
    .range([height, 0]);


// Turns points into lines that can be graphed 
const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    //Creates lines to make desk
svg.selectAll('path')
    .data(pathCoordinates)
    .enter()
    .append('path') // add a path to the existing svg
    .attr('d', line) // do your magic, line!
    .attr('fill', "green") // Makes desk green
    .attr("id", (d) => "desk-" + d[0].name)
    .style("stroke", "black") // removes border
    .on('click', function(d) {

        i = d[0].name; //Gives desk number clicked
        if (document.getElementById("student" + i).style.opacity == "0") { // If no student there, puts student there
            document.getElementById("desk-" + i).style.fill = "green";
            document.getElementById("desk-" + i).style.stroke = "black";
            document.getElementById("student" + i).style.opacity = "100";

            desks[i][0].hasStudent = true;
        } else if (document.getElementById("desk-" + i).style.fill == "lightblue") { // If student had covid on click, removes student
            document.getElementById("desk-" + i).style.fill = "green";
            document.getElementById("desk-" + i).style.stroke = "black";;
            document.getElementById("student" + i).style.opacity = "0";
            desks[i][0].hasStudent = false;
        } else { //If student is normal befor click, changes color to reflect student has COVID
            document.getElementById("desk-" + i).style.fill = "lightblue"
        };

        updateValues();



    })
    .on('mouseover', function(d, i) { //Highlights desk on hover
        d3.select(this)
            .attr('opacity', "0.8");
    })
    .on('mouseout', function(d, i) { //Removes highlighting from desk
        d3.select(this)
            .attr('opacity', '1');
    });
//Makes circles to represent students
svg.selectAll('circle')
    .data(studentCenters)
    .enter()
    .append('circle')
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y))
    .attr("r", 5)
    .attr("fill", "yellow")
    .attr("id", (d, i) => "student" + i)
    //Makes circle to represent teacher
svg.append("circle")
    .attr("cx", (d) => width / 2)
    .attr("cy", (d) => height - yScale(2))
    .attr("r", 5)
    .attr("fill", "yellow")
    .attr("id", "teacher")
    .on('click', function(d) { //Makes teacher be colored to show they have or don't have COVID changing on click
        if (teacherPoints[0].hasCovid == true) {
            document.getElementById("teacher").style.fill = "yellow";
            teacherPoints[0].hasCovid = false;
        } else {
            document.getElementById("teacher").style.fill = "lightblue";
            teacherPoints[0].hasCovid = true;
        }
        updateValues();

    });
let makeNewChart = () => { //Clears SVG
    d3.select("svg").selectAll("path").remove()
    chart();
};

let updateValues = () => {
    if (teacherPoints[0].hasCovid != true) { // resets teacher color
        document.getElementById("teacher").style.fill = "yellow";
    }
    for (let o = desks.length - 1; o > 0 - 1; o--) {
        desks[o][0].isQuarantined = false;
        if (document.getElementById("desk-" + o).style.fill != "black" && document.getElementById("desk-" + o).style.fill != "lightblue") { // resets student color if they don't have covid and are at a desk
            document.getElementById("desk-" + o).style.fill = "green";
        };
    }
    for (let o = desks.length - 1; o > -1; o--) {

        if (document.getElementById("desk-" + o).style.fill == "lightblue") { // For ever student that has COVID determines how many students have to quarantine

            for (let h = desks.length - 1; h > 0 - 1; h--) { //Determines whether individual student has to quarantine
                let studentQuarantined = false;
                for (let z = desks[o].length - 1; z > 0 - 1; z--) {
                    testX = students[o][z].x;
                    testY = students[o][z].y;

                    for (let j = desks[h].length - 1; j > 0 - 1; j--) {
                        let currentX = students[h][j].x;
                        let currentY = students[h][j].y;
                        if (Math.pow(Math.pow(testX - currentX, 2) + Math.pow(testY - currentY, 2), 0.5) < 6) {
                            if (desks[h][0].hasStudent && h != desks[o][0].name && document.getElementById("desk-" + h).style.fill != "lightblue") {

                                desks[h][0].isQuarantined = true; // If student is within 6 feet of student with COVID they get marked quarantined
                            }
                        }
                    }

                }


            }
            //Determines whether teacher has to quarantine
            for (let h = teacherPoints.length - 1; h > 0 - 1; h--) {
                let currentX = teacherPoints[h].x;
                let currentY = teacherPoints[h].y;
                for (let z = 0; z < desks[o].length; z++) {
                    testX = students[o][z].x;
                    testY = students[o][z].y;

                    if (Math.pow(Math.pow(testX - currentX, 2) + Math.pow(testY - currentY, 2), 0.5) < 6) {
                        if (teacherPoints[0].hasCovid != true) {
                            document.getElementById("teacher").style.fill = "crimson";

                        }
                    }
                }
            }

        }
    }
    if (teacherPoints[0].hasCovid == true) {
        //Determines what students have to quarantine if teacher has COVID
        for (let h = 0; h < teacherPoints.length; h++) {
            testX = teacherPoints[h].x;
            testY = teacherPoints[h].y;
            for (let o = 0; o < desks.length; o++) {
                for (let z = 0; z < desks[o].length; z++) {
                    let currentX = students[o][z].x;
                    let currentY = students[o][z].y;
                    if (Math.pow(Math.pow(testX - currentX, 2) + Math.pow(testY - currentY, 2), 0.5) < 6) {
                        if (desks[o][0].hasStudent && document.getElementById("desk-" + o).style.fill != "lightblue") {

                            desks[o][0].isQuarantined = true;
                        }
                    }
                }
            }


        }

    }
    studentsRequiredToQuarantine = 0;
    covidCases = 0;
    totalStudents = 0;
    //Determines total counts
    for (let o = desks.length - 1; o > 0 - 1; o--) {
        if (desks[o][0].isQuarantined == true) {
            document.getElementById("desk-" + o).style.fill = "crimson" //Changes color of desk if student quarantined
            studentsRequiredToQuarantine++;
        }
        if (document.getElementById("desk-" + o).style.fill == "lightblue") {
            covidCases++;
        }
        if (desks[o][0].hasStudent) {
            totalStudents++;
        }
    }
    //Determines percent of class that has to quarantine

    let quarantinePercent = Math.round(100 * studentsRequiredToQuarantine / totalStudents);
    if (isNaN(quarantinePercent)) {
        quarantinePercent = 0;
    }
    let positivePercent = Math.round(100 * covidCases / totalStudents);
    if (isNaN(positivePercent)) {
        positivePercent = 0;
    }
    if (sessionStorage.calcingStuff == "true") { //Don't output if in the meddle of generating sims

    } else {

        document.getElementById("test").innerHTML = studentsRequiredToQuarantine + " Students Quarantined [" + quarantinePercent + "%], " + covidCases + " Positive(s) [" + positivePercent + "%], " + totalStudents + " Students Total.";
    }
}
let removeAllStudents = () => {
    //Removes all students from desks
    for (let i = students.length - 1; i > 0 - 1; i--) {
        document.getElementById("desk-" + i).style.fill = "green";
        document.getElementById("desk-" + i).style.stroke = "black";;
        document.getElementById("student" + i).style.opacity = "0";
        desks[i][0].hasStudent = false;
    }
    updateValues();
}
let resetAllStudents = () => {
    //Puts all students back in desks
    for (let i = students.length - 1; i > 0 - 1; i--) {
        document.getElementById("desk-" + i).style.fill = "green";
        document.getElementById("desk-" + i).style.stroke = "black";
        document.getElementById("student" + i).style.opacity = "100";
        desks[i][0].hasStudent = true;
    }
    updateValues();

}
let generateClass = () => {
    let studentNumber = document.getElementById("rngStudentNumber").value;
    if (studentNumber > desks.length || studentNumber < 1) {
        alert("You can only generate class with 1 to " + desks.length + " students")
        return;
    }
    //Generates a random arrangement of x amount of students
    removeAllStudents();
    //Gets number of students from what is inputted by user

    studentDeskPlacedNumbers = [];
    for (let i = 0; i < studentNumber; i++) {
        let newDesk = Math.floor(Math.random() * desks.length);
        // Keeps getting new numbers until x amount of unique desks are chosen
        while (studentDeskPlacedNumbers.some((element) => (element == newDesk))) {
            newDesk = Math.floor(Math.random() * desks.length)
        };
        studentDeskPlacedNumbers.push(newDesk);


    }

    for (let i = 0; i < studentDeskPlacedNumbers.length; i++) {
        // For all desks chosen, puts student in desk
        document.getElementById("desk-" + studentDeskPlacedNumbers[i]).style.fill = "green";
        document.getElementById("desk-" + studentDeskPlacedNumbers[i]).style.stroke = "black";
        document.getElementById("student" + studentDeskPlacedNumbers[i]).style.opacity = "100";
        desks[studentDeskPlacedNumbers[i]][0].hasStudent = true;
    }
    updateValues();
}
let startArrangementStuff = () => {
    //Tried to get loading symbol for when finding best arrangement, this doesn't work though :(
    buffer();
    document.getElementById("spinny").classList.add("fa-spinner");
    document.getElementById("spinny").classList.add("fa-spin");
    findBestArrangement();
    document.getElementById("spinny").classList.remove("fa-spinner");
    document.getElementById("spinny").classList.remove("fa-spin");
    updateValues();

}
let buffer = () => {
    // Also doesn't work :(
    document.getElementById("spinny").classList.add("fa-spinner");
    document.getElementById("spinny").classList.add("fa-spin");
}
let findBestArrangement = () => {
    sessionStorage.calcingStuff = true;
    updateValues();
    //Tries to find best arrangement of desks to minimize number of students quarantined by running 100 different desk arrangements
    let studentBestNumbers = [];
    let quarantineCasesInScenario = 0;
    let bestScenario = 100000;
    document.getElementById("rngStudentNumber").value = totalStudents;

    for (let h = 0; h < 3; h++) {
        percentDone = h * 10;

        alert(h * 33 + "% done");
        for (let g = 0; g < 20; g++) {
            console.log(g)
            generateClass();
            if (g + h == 0) {
                document.getElementById("spinny").classList.add("fa-spinner");
                document.getElementById("spinny").classList.add("fa-spin");
                alert("starting!");
            }
            quarantineCasesInScenario = 0;


            for (let i = totalStudents - 1; i > 0 - 1; i--) {
                //Tests to see how many students get quarantined if 1 person in class gets covid, repeats this for every person in class
                document.getElementById("desk-" + studentDeskPlacedNumbers[i]).style.fill = "lightblue";
                updateValues();

                document.getElementById("desk-" + studentDeskPlacedNumbers[i]).style.fill = "green";
                document.getElementById("desk-" + studentDeskPlacedNumbers[i]).style.stroke = "black";
                document.getElementById("student" + studentDeskPlacedNumbers[i]).style.opacity = "100";
                //Collects total number of people quarantined in sim
                quarantineCasesInScenario += studentsRequiredToQuarantine;
            }
            if (quarantineCasesInScenario < bestScenario) {
                //If total number less than any previous sim, then arrangement is saved as best sim
                bestScenario = quarantineCasesInScenario;
                studentBestNumbers = studentDeskPlacedNumbers;
            }
        }
    }
    //Clears students to show best arrangement
    removeAllStudents();
    for (let i = studentBestNumbers.length - 1; i > -1; i--) {
        //Puts students in best arrangement to show user
        document.getElementById("desk-" + studentBestNumbers[i]).style.fill = "green";
        document.getElementById("desk-" + studentBestNumbers[i]).style.stroke = "black";
        document.getElementById("student" + studentBestNumbers[i]).style.opacity = "100";
        desks[studentDeskPlacedNumbers[i]][0].hasStudent = true;
    }
    sessionStorage.calcingStuff = false;
    console.log(bestScenario)
    console.log(studentBestNumbers)
    let average = (1.0 * bestScenario) / studentBestNumbers.length
    console.log(average)
    alert("done! best is an average of " + average.toFixed(2) + " quarantines per 1 COVID case");

}