const LINK = "http://webapi19sa-1.course.tamk.cloud/v1/weather/"

function get(source, period) {
    let xhr = new XMLHttpRequest();

    let link = LINK+source;
    if (period !== "") {
      link+='/'+period;
    }

    xhr.open("GET", link, false);
    xhr.send();

    if (xhr.status === 200 && xhr.readyState === 4) {
      return xhr.responseText;
    }
}


function mainTable() {

    const title = document.getElementById('title');
    title.innerHTML = "Home Page"
    let description = document.getElementById('description');
    description.innerHTML = 'The data below is obtained from the weather station' +
        '<br> of Tampere University of Applied Sciences.' +
        '<br> <br> All the latest data:';

    let tableSpan = document.getElementById("table");
    let html = `<table id="mainTable">
                      <tr>
                        <th>№</th>
                        <th>Time</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Value</th>
                      </tr>
    `;

    let data = JSON.parse(get("", ""));

    for (let i = 0; i < 30; i++) {
      const element = data[i];
      const period = element.date_time.replace("Z", "T").split("T");
      const date = period[0];
      const time = period[1];
      const type = Object.keys(element.data)[0];
      const value = element.data[type];

      html += `<tr>
                <td>${i+1}</td>
                <td>${time}</td>
                <td>${date}</td>
                <td>${type}</td>
                <td>${value}</td>
              </tr>`;

    }

    html += '</table>';
    tableSpan.innerHTML = html;

    let ctx = document.getElementById("canvas");
    if (ctx) {
      ctx.remove();
    }

    let menu = document.getElementById("timeMenu");
    if (menu) {
      menu.remove();
      menu = document.createElement("select");
      menu.setAttribute("id", "timeMenu");
    }

    let menu1 = document.getElementById("typeMenu");
    if (menu1) {
      menu1.remove();
      menu1 = document.createElement("select");
      menu1.setAttribute("id", "typeMenu");
    }

}


function otherTable(name, period, type) {

  let tableSpan = document.getElementById("table");

  let html = `<table id="otherTable">
                    <tr>
                      <th>№</th>
                      <th>Time</th>
                      <th>Date</th>
                      <th>Value</th>
                    </tr>
  `;

  let data = JSON.parse(get(name, period));

  let title = document.getElementById('title');
  let description = document.getElementById('description');
  description.innerHTML = 'The data below is obtained from the weather station' +
  '<br> of Tampere University of Applied Sciences.';

  if (name === "temperature") {
    title.innerHTML = "Temperature Measurements";
  }
  /* The wind speed data is irrelevant at the moment
  else if (name === "wind_speed") {
    title.innerHTML = "Wind Speed";
  }
  */

  for (let i = 0; i < data.length; i++) {
      const element = data[i];
      const period = element.date_time.replace("Z", "T").split("T");
      const date = period[0];
      const time = period[1];
      const value = element[name];

        html += `<tr>
        <td>${i+1}</td>
        <td>${time}</td>
        <td>${date}</td>
        <td>${value}</td>
      </tr>`;
  }

  html += '</table>';
  tableSpan.innerHTML = html;

  drawChart(data, name, type);

}


function buttonInfo() {

  let title = document.getElementById('title');
  title.innerHTML = 'Information';
  let description = document.getElementById('description');
  description.innerHTML = '';

  let info = document.getElementById('table')
  info.innerHTML = 'Created by: Ivan Gromov <br> Contact: <a href="mailto:ivan.grcmcv@gmail.com">ivan.grcmcv@gmail.com</a>' +
      '';

  let ctx = document.getElementById("canvas");
  if (ctx) {
    ctx.remove();
  }

  let menu = document.getElementById("timeMenu");
  if (menu) {
    menu.remove();
    menu = document.createElement("select");
    menu.setAttribute("id", "timeMenu");
  }

  let menu1 = document.getElementById("typeMenu");
  if (menu1) {
    menu1.remove();
    menu1 = document.createElement("select");
    menu1.setAttribute("id", "typeMenu");
  }

}


function drawChart(data, name, type) {

  let ctx = document.getElementById("canvas");
  let canvas = "";
  if (ctx == null) {
    canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
  }
  else {
    ctx.remove();
    canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
  }

  let labels = [];
  let values = [];

  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    labels[i] = element.date_time.replace("Z", "T").split("T");
    values[i] = element[name];
  }

  const chart = new Chart(canvas, {
    data: {
        labels: labels,
        datasets: [{
            type: type,
            label: "Weather Data",
            data: values,
            backgroundColor: [
                'rgba(44, 74, 82, 0.7)',
                'rgba(83, 112, 114, 0.7)',
                'rgba(142, 155, 151, 0.7)',
                'rgba(244, 235, 219, 0.7)',
                'rgba(239, 222, 205, 0.7)',
                'rgba(255, 218, 185, 0.7)'
            ],
            borderColor: [
                'rgba(44, 74, 82, 1)',
                'rgba(83, 112, 114, 1)',
                'rgba(142, 155, 151, 1)',
                'rgba(244, 235, 219, 1)',
                'rgba(239, 222, 205, 1)',
                'rgba(255, 218, 185, 1)'
            ],
            borderWidth: 1
        },
        ]
    },
});

  let div = document.getElementById("chart");
  div.appendChild(canvas);

}


function timeMenu(val, free) {
  let span = document.getElementById("menu");

  let menu = document.getElementById("timeMenu");
  if (menu == null) {
    menu = document.createElement("select");
    menu.setAttribute("id", "timeMenu");
  } else {
    menu.remove();
    menu = document.createElement("select");
    menu.setAttribute("id", "timeMenu");
  }

  html = `<option value="" onclick="createPage('', '${val}', ${free});"> Live </option>
  <option value="24" onclick="createPage('23', '${val}', ${free});"> 24 hours </option>
  <option value="48" onclick="createPage('47', '${val}', ${free});"> 48 hours </option>
  <option value="72" onclick="createPage('71', '${val}', ${free});"> 72 hours </option>
  <option value="168" onclick="createPage('167', '${val}', ${free});"> 1 week </option>`;

  menu.innerHTML = html;
  span.appendChild(menu);

}

function measurementTypeMenu() {

  let title = document.getElementById('title');
  title.innerHTML = 'Data of your choice'

  const names = JSON.parse(get("names",""));

  let span = document.getElementById("menu");

  let menu = document.getElementById("typeMenu");
  if (menu == null) {
    menu = document.createElement("select");
    menu.setAttribute("id", "typeMenu");
  } else {
    menu.remove();
    menu = document.createElement("select");
    menu.setAttribute("id", "typeMenu");
  }

  let html = `<option selected value="${names[0].name}" onclick="setType();" > ${names[0].name} </option>`;

  for (let i = 1; i < names.length; i++) {
    const name = names[i].name;
    html += `<option value="${name}" onclick="setType();"> ${name} </option>`
  }

  menu.innerHTML = html;
  span.appendChild(menu);
}

function getType() {
  return document.getElementById("typeMenu").value;
}

function setType() {
  timeMenu(getType(), true);
}


function createPage(period, val, free) {

  if (free) {
    measurementTypeMenu();
    timeMenu(getType(),true);
    otherTable(val, period, 'line')
  }
  else {
    let menu = document.getElementById("typeMenu");
    if (menu != null) {
      menu.remove();
      menu = document.createElement("select");
      menu.setAttribute("id", "typeMenu");
    }

    otherTable(val, period, 'bar');
    timeMenu(val, false);
  }

}

window.onload = function() {
  mainTable();
}