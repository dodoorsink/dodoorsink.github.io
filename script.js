/*

도어

*/

function select_door(select) {
  const door = select.value;
  const divisionSelect = document.getElementById("option_division");
  const ncSelect = document.getElementById("option_nc");

  divisionSelect.innerHTML = "<option value=''>선택하세요</option>"; // 초기화
  ncSelect.innerHTML = "<option value=''>선택하세요</option>";
  ncSelect.disabled = true; // 초기화 시 NC 디자인 비활성화

  if (door) {
    const divisions = ["유광", "무광"];

    // 구분 옵션을 추가
    divisions.forEach(function (division) {
      const option = document.createElement("option");
      option.value = division;
      option.textContent = division;
      divisionSelect.appendChild(option);
    });
  } else {
    // divisionSelect.innerHTML = "<option value=''>선택하세요</option>"; // 이미 초기화 상태
  }

  if (door === "도장 NC디자인") {
    ncSelect.disabled = false;
    fetch("tbl_nc.json")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((nc) => {
          const option = document.createElement("option");
          option.value = nc.item;
          option.textContent = nc.item;
          ncSelect.appendChild(option);
        });
      });
  }
}

function updateColorOptions(select) {
  const division = select.value;
  const doorSelect = document.getElementById("option_door").value;
  const colorSelect = document.getElementById("option_color");

  if (!doorSelect || !division) {
    colorSelect.innerHTML = "<option value=''>선택하세요</option>";
    return;
  }

  fetch("tbl_door.json")
    .then((res) => res.json())
    .then((data) => {
      colorSelect.innerHTML = "<option value=''>선택하세요</option>";
      const matchedColors = data.filter((item) => item.color === doorSelect && item.type === division);
      matchedColors.forEach((color) => {
        const option = document.createElement("option");
        option.value = color.title;
        option.textContent = color.title;
        colorSelect.appendChild(option);
      });
    });
}

function adjustDoorWidth(delta) {
  const widthInput = document.getElementById("door_width");
  let width = parseInt(widthInput.value) || 0;

  if (delta > 0) {
    width += width >= 100 ? 100 : 10;
  } else {
    width -= width > 100 ? 100 : 10;
  }
  width = Math.max(60, Math.min(width, 1200));
  widthInput.value = width;
}

function adjustDoorHeight(delta) {
  const heightInput = document.getElementById("door_height");
  let height = parseInt(heightInput.value) || 0;

  height += delta * 100;
  height = Math.max(100, Math.min(height, 2400));
  heightInput.value = height;
}

function adjustDoorQuantity(delta) {
  const quantityInput = document.getElementById("quantity");
  let quantity = parseInt(quantityInput.value) || 0;

  quantity += delta;
  quantity = Math.max(1, quantity);
  quantityInput.value = quantity;
}

function toggleCheckbox(currentCheckbox) {
  const checkboxes = document.querySelectorAll('input[name="shelf"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox !== currentCheckbox) {
      checkbox.checked = false;
    }
  });
}

function getUnitValue(units, value) {
  for (let unit of units) {
    if (value <= unit) return unit;
  }
  return 0;
}

async function addDoorToTable() {
  const values = {
    type: document.getElementById("option_door").value,
    color: document.getElementById("option_color").value,
    ncDesign: document.getElementById("option_nc").value,
    width: parseInt(document.getElementById("door_width").value),
    height: parseInt(document.getElementById("door_height").value),
    hinges: document.getElementById("door_hinges").value,
    quantity: parseInt(document.getElementById("quantity").value) || 1,
    options: Array.from(document.querySelectorAll('input[name="shelf"]:checked')).map((cb) => cb.value),
  };
  const tableBody = document.querySelector("#table tbody");
  const newRow = tableBody.insertRow();

  const widthUnits = [199, 399, 599, 799, 999, 1199];
  const heightUnits = [399, 799, 1199, 1399, 1599, 1799, 1999, 2399];
  const unitWidth = getUnitValue(widthUnits, values.width);
  const unitHeight = getUnitValue(heightUnits, values.height);

  // 추가 벨리데이션 필요
  if (!unitWidth || !unitHeight) {
    alert("도어 사이즈가 올바르지 않습니다.");
    return;
  }

  const cell1 = newRow.insertCell();
  cell1.innerHTML = '<input type="checkbox">';
  cell1.classList.add("text-center");

  const cell2 = newRow.insertCell();
  cell2.textContent = `${values.type} ${values.color} ${values.ncDesign} ${values.options.join(", ")}`;
  cell2.classList.add("text-center");

  const cell3 = newRow.insertCell();
  cell3.textContent = `18 X ${values.width} X ${values.height}`;
  cell3.classList.add("text-center");

  const cell4 = newRow.insertCell();
  cell4.textContent = values.hinges;
  cell4.classList.add("text-center");

  const cell5 = newRow.insertCell();
  cell5.textContent = values.quantity;
  cell5.classList.add("text-center");

  const cell6 = newRow.insertCell();
  cell6.classList.add("text-center");

  try {
    const response = await fetch("tbl_price.json");
    const priceData = await response.json();
    const match = priceData.find((item) => item["구분"] === values.type && item["가로"] === unitWidth && item["세로"] === unitHeight);
    if (match) {
      let totalPrice = match["가격"] * values.quantity;
      if (values.options.includes("후면도장")) {
        totalPrice *= 1.2;
      }
      cell6.textContent = totalPrice.toLocaleString();
      alert("도어가 성공적으로 담겼습니다!");
    } else {
      cell6.textContent = "가격 없음";
      cell6.style.color = "red";
    }
  } catch (error) {
    alert("도어 담기에 실패했습니다. 관리자에게 문의해주세요.");
    cell6.textContent = "가격 계산 실패";
    cell6.style.color = "red";
  }

  calculateTotalPrice();
}

/*

F바

*/
function selectFbar() {
  const fbarSelect = document.getElementById("option_fbar");
  fetch("tbl_fbar.json")
    .then((res) => res.json())
    .then((data) => {
      fbarSelect.innerHTML = "<option value=''>선택하세요</option>";
      data.forEach((fbar) => {
        const option = document.createElement("option");
        option.value = fbar.color;
        option.textContent = fbar.color;
        fbarSelect.appendChild(option);
      });
    });
}

function adjustFbarWidth(delta) {
  const widthInput = document.getElementById("fbarWidth");
  let width = parseInt(widthInput.value) || 0;

  width += delta * 50;
  width = Math.max(100, Math.min(width, 2400));
  widthInput.value = width;
}

function adjustFbarQuantity(delta) {
  const quantityInput = document.getElementById("fbarQuantity");
  let quantity = parseInt(quantityInput.value) || 0;

  quantity += delta;
  quantity = Math.max(1, quantity);
  quantityInput.value = quantity; // 값 업데이트
}

function addFbarToTable() {
  const fbarColor = document.getElementById("option_fbar").value;
  const fbarWidth = parseInt(document.getElementById("fbarWidth").value) || 0;
  const fbarQuantity = parseInt(document.getElementById("fbarQuantity").value) || 1;

  const tableBody = document.querySelector("#table tbody");
  const newRow = tableBody.insertRow();

  const cell1 = newRow.insertCell();
  cell1.innerHTML = '<input type="checkbox">';
  cell1.classList.add("text-center");

  const cell2 = newRow.insertCell();
  cell2.textContent = `F바 ${fbarColor}`;
  cell2.classList.add("text-center");

  const cell3 = newRow.insertCell();
  cell3.textContent = `${fbarWidth} mm`;
  cell3.classList.add("text-center");

  const cell4 = newRow.insertCell();
  cell4.textContent = "-";
  cell4.classList.add("text-center");

  const cell5 = newRow.insertCell();
  cell5.textContent = fbarQuantity;
  cell5.classList.add("text-center");

  const pricePer100mm = 2000;
  const widthIn100Units = Math.floor(fbarWidth / 100);

  const cell6 = newRow.insertCell();
  cell6.classList.add("text-center");

  if (fbarWidth < 100) {
    cell6.textContent = "길이 오류";
    cell6.style.color = "red";
  } else {
    const totalPrice = widthIn100Units * pricePer100mm * fbarQuantity;
    cell6.textContent = totalPrice.toLocaleString();
  }

  calculateTotalPrice();
}

/*

부자재

*/
let materialData = [];

function getMaterialData() {
  const materialSelect = document.getElementById("option_material");
  fetch("tbl_material.json")
    .then((res) => res.json())
    .then((data) => {
      materialData = data;
      materialData.forEach((material) => {
        const option = document.createElement("option");
        option.value = material.item;
        option.textContent = material.item;
        materialSelect.appendChild(option);
      });
    });
}

function adjustMaterialQuantity(delta) {
  const quantityInput = document.getElementById("materialQuantity");
  let quantity = parseInt(quantityInput.value) || 0;

  quantity += delta;
  quantity = Math.max(1, quantity);
  quantityInput.value = quantity;
}

function adjustMaterialQuantity(delta) {
  const quantityInput = document.getElementById("materialQuantity");
  let quantity = parseInt(quantityInput.value) || 0;

  quantity += delta;
  quantity = Math.max(1, quantity);
  quantityInput.value = quantity;
}

function addMaterialToTable() {
  const materialType = document.getElementById("option_material").value;
  const materialQuantity = parseInt(document.getElementById("materialQuantity").value) || 1;
  const material = materialData.find((item) => item.item === materialType);

  const tableBody = document.querySelector("#table tbody");
  const newRow = tableBody.insertRow();

  const cell1 = newRow.insertCell();
  cell1.innerHTML = '<input type="checkbox">';
  cell1.classList.add("text-center");

  const cell2 = newRow.insertCell();
  cell2.textContent = materialType;
  cell2.classList.add("text-center");

  const cell3 = newRow.insertCell();
  cell3.textContent = "-";
  cell3.classList.add("text-center");

  const cell4 = newRow.insertCell();
  cell4.textContent = "-";
  cell4.classList.add("text-center");

  const cell5 = newRow.insertCell();
  cell5.textContent = materialQuantity;
  cell5.classList.add("text-center");

  const cell6 = newRow.insertCell();
  cell6.classList.add("text-center");

  if (material) {
    const totalPrice = material.price * materialQuantity;
    cell6.textContent = totalPrice.toLocaleString();
  } else {
    cell6.textContent = "가격 정보 없음";
    cell6.style.color = "red";
  }

  calculateTotalPrice();
}

/*

주문표

*/
function deleteSelectedRows() {
  const checkboxes = document.querySelectorAll('#table tbody input[type="checkbox"]:checked');
  checkboxes.forEach((checkbox) => {
    checkbox.closest("tr").remove();
  });
  calculateTotalPrice();
}

function deleteAllRows() {
  const tableBody = document.querySelector("#table tbody");
  tableBody.innerHTML = "";
  calculateTotalPrice();
}

function calculateTotalPrice() {
  const priceCells = document.querySelectorAll("#table tbody td:nth-child(6)"); // 가격 셀 선택
  let totalPrice = 0;

  priceCells.forEach((cell) => {
    const priceText = cell.textContent.replace(/[^0-9]/g, "");
    if (priceText) {
      totalPrice += parseInt(priceText);
    }
  });

  const totalPriceElement = document.getElementById("totalPrice");
  if (!totalPriceElement) {
    const tableContainer = document.querySelector(".table-responsive");
    const newTotalPriceElement = document.createElement("p");
    newTotalPriceElement.id = "totalPrice";
    newTotalPriceElement.style.textAlign = "right";
    tableContainer.parentNode.insertBefore(newTotalPriceElement, tableContainer.nextSibling);
  }

  document.getElementById("totalPrice").textContent = "총 견적 금액: " + totalPrice.toLocaleString() + "원";
}

async function sendOrderEmail() {
  const customerName = document.getElementById("customerName").value;
  const customerContact = document.getElementById("customerContact").value;
  const customerRequirements = document.getElementById("customerRequirements").value;
  const totalPrice = document.getElementById("totalPrice").textContent.replace(/[^0-9]/g, "") || 0;

  const tableRows = document.querySelectorAll("#table tbody tr");
  const tableData = Array.from(tableRows).map((row) => {
    const cells = row.querySelectorAll("td");
    return {
      product: cells[1]?.textContent || "",
      size: cells[2]?.textContent || "",
      hinges: cells[3]?.textContent || "",
      quantity: cells[4]?.textContent || "",
      price: cells[5]?.textContent || "",
    };
  });

  const emailData = {
    customerName,
    customerContact,
    customerRequirements,
    totalPrice,
    tableData,
  };

  console.log(emailData);

  try {
    const response = await fetch("/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailData),
    });

    if (response.ok) {
      alert("이메일이 성공적으로 전송되었습니다.");
    } else {
      alert("이메일 전송에 실패했습니다. 판매자에게 문의해주세요.");
    }
  } catch (error) {
    console.error("이메일 전송 오류:", error);
    alert("이메일 전송 중 오류가 발생했습니다.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  selectFbar();
  getMaterialData();
});
