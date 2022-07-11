"use strict";

const calculateDiscount = (customer, subtotal) => {
  if (customer == "reg") {
    if (subtotal >= 100 && subtotal < 250) {
      return 0.1;
    } else if (subtotal >= 250 && subtotal < 500) {
      return 0.25;
    } else if (subtotal >= 500) {
      return 0.3;
    } else {
      return 0;
    }
  } else if (customer == "loyal") {
    return 0.3;
  } else if (customer == "honored") {
    if (subtotal < 500) {
      return 0.4;
    } else {
      return 0.5;
    }
  }
};

const formatDate = (date) => {
  const year = date.getFullYear();
  // add 1 since months start at 0
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let dateText = "";
  // pad month if 1 digit
  dateText += month.toString().padStart(2, "0") + "/";
  // pad day if 1 digit
  dateText += day.toString().padStart(2, "0") + "/";
  dateText += year;

  return dateText;
};

$(document).ready(() => {
  $("#calculate").click(() => {
    const customerType = $("#type").val();
    let subtotal = $("#subtotal").val();
    subtotal = parseFloat(subtotal);
    if (isNaN(subtotal) || subtotal <= 0) {
      alert("Subtotal must be a number greater than zero.");
      $("#clear").click();
      $("#subtotal").focus();
      return;
    }

    let dateString = "";
    const invoiceDate = $("#invoice_date").val().trim();
    if (invoiceDate.length == 0) {
      dateString = formatDate(new Date());
    } else {
      let isValidDate = true;

      const datePattern = /^[01]?\d\/[0-3]\d\/\d{4}$/;
      // this will match dates like 19/21/2020 and 9/39/2021
      if (!datePattern.test(invoiceDate)) {
        isValidDate = false;
      }

      if (isValidDate) {
        $("#invoice_date").next().text("");
        $("#invoice_date").val(formatDate(new Date(invoiceDate)));
        dateString = invoiceDate;
      } else {
        $("#invoice_date")
          .next()
          .text("Please enter the date in MM/DD/YYYY format.");
        $("#clear").click();
        $("#invoice_date").focus();
        return;
      }
    }

    const dueDate = new Date(dateString);
    dueDate.setDate(dueDate.getDate() + 30);
    let dueDateString = formatDate(dueDate);
    $("#due_date").val(dueDateString);

    const discountPercent = calculateDiscount(customerType, subtotal);
    const discountAmount = subtotal * discountPercent;
    const invoiceTotal = subtotal - discountAmount;

    $("#subtotal").val(subtotal.toFixed(2));
    $("#percent").val((discountPercent * 100).toFixed(2));
    $("#discount").val(discountAmount.toFixed(2));
    $("#total").val(invoiceTotal.toFixed(2));

    // set focus on type drop-down when done
    $("#type").focus();
  });

  $("#clear").click(() => {
    $("#type").val("reg");
    $("#subtotal").val("");
    $("#invoice_date").val("");
    $("#percent").val("");
    $("#discount").val("");
    $("#total").val("");
    $("#due_date").val("");

    // set focus on type drop-down when done
    $("#type").focus();
  });

  // set focus on type drop-down on initial load
  $("#type").focus();
});
