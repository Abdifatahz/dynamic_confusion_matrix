document
  .getElementById("classForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const numClasses = parseInt(document.getElementById("numClasses").value);
    createMatrixInputs(numClasses);
    document.getElementById("confusionMatrixForm").style.display = "block";
  });

document
  .getElementById("confusionMatrixForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const numClasses = parseInt(document.getElementById("numClasses").value);
    generateConfusionMatrixTable(numClasses);
    generateSummaryTable(numClasses);
  });

function createMatrixInputs(classes) {
  const matrixInputsDiv = document.getElementById("matrixInputs");
  matrixInputsDiv.innerHTML = "";

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  let headerRow = "<tr><th></th>";
  for (let i = 0; i < classes; i++) {
    headerRow += `<th>Predicted ${i}</th>`;
  }
  headerRow += "</tr>";
  thead.innerHTML = headerRow;

  for (let i = 0; i < classes; i++) {
    let row = `<tr><th>Actual ${i}</th>`;
    for (let j = 0; j < classes; j++) {
      const defaultValue =
        i === j
          ? 2
          : i === 0 && j === 1
          ? 0
          : i === 1 && j === 2
          ? 0
          : i === 2 && j === 1
          ? 1
          : 0;
      row += `<td><input type="number" id="${i}-${j}" value="${defaultValue}" required></td>`;
    }
    row += "</tr>";
    tbody.innerHTML += row;
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  matrixInputsDiv.appendChild(table);
}

function generateConfusionMatrixTable(classes) {
  const confusionMatrix = [];
  for (let i = 0; i < classes; i++) {
    const row = [];
    for (let j = 0; j < classes; j++) {
      row.push(parseInt(document.getElementById(`${i}-${j}`).value));
    }
    confusionMatrix.push(row);
  }

  const confusionMatrixTableBody = document.querySelector(
    "#confusionMatrixTable tbody"
  );
  const confusionMatrixTableHead = document.querySelector(
    "#confusionMatrixTable thead"
  );
  confusionMatrixTableBody.innerHTML = ""; // Clear previous content
  confusionMatrixTableHead.innerHTML = ""; // Clear previous content

  let headerRow = "<tr><th></th>";
  for (let i = 0; i < classes; i++) {
    headerRow += `<th>Predicted ${i}</th>`;
  }
  headerRow += "</tr>";
  confusionMatrixTableHead.innerHTML = headerRow;

  for (let i = 0; i < classes; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `<th>Actual ${i}</th>`;
    for (let j = 0; j < classes; j++) {
      row.innerHTML += `<td id="cell-${i}-${j}">${confusionMatrix[i][j]}</td>`;
    }
    confusionMatrixTableBody.appendChild(row);
  }
}

function generateSummaryTable(classes) {
  const confusionMatrix = [];
  for (let i = 0; i < classes; i++) {
    const row = [];
    for (let j = 0; j < classes; j++) {
      row.push(parseInt(document.getElementById(`${i}-${j}`).value));
    }
    confusionMatrix.push(row);
  }

  const summaryTableBody = document.querySelector("#summaryTable tbody");
  summaryTableBody.innerHTML = ""; // Clear previous content

  for (let i = 0; i < classes; i++) {
    let TP = confusionMatrix[i][i];
    let FN = 0;
    let FP = 0;
    let TN = 0;

    for (let j = 0; j < classes; j++) {
      if (j !== i) {
        FN += confusionMatrix[i][j];
        FP += confusionMatrix[j][i];
      }
      for (let k = 0; k < classes; k++) {
        if (j !== i && k !== i) {
          TN += confusionMatrix[j][k];
        }
      }
    }

    let accuracy = (TP + TN) / (TP + TN + FP + FN);
    let recall = TP / (TP + FN);
    let precision = TP / (TP + FP);
    let f1Score = (2 * (precision * recall)) / (precision + recall);

    const row = document.createElement("tr");

    let accuracyClass = "";
    if (accuracy >= 0.9) {
      accuracyClass = "high-accuracy";
    } else if (accuracy >= 0.7) {
      accuracyClass = "moderate-accuracy";
    } else {
      accuracyClass = "low-accuracy";
    }

    row.innerHTML = `
            <td>${i}</td>
            <td class="highlight">${TP}</td>
            <td class="highlight">${TN}</td>
            <td class="highlight">${FP}</td>
            <td class="highlight">${FN}</td>
            <td class="${accuracyClass}">${accuracy.toFixed(2)}</td>
            <td>${recall.toFixed(2)}</td>
            <td>${precision.toFixed(2)}</td>
            <td>${f1Score.toFixed(2)}</td>
        `;

    summaryTableBody.appendChild(row);
  }
}

// Initialize the form with default sample data
document.addEventListener("DOMContentLoaded", function () {
  createMatrixInputs(3);
  document.getElementById("confusionMatrixForm").style.display = "block";
});
