function calculatePayment() {
  const homePrice = parseFloat(document.getElementById("home-price").value);
  const downPayment =
    parseFloat(document.getElementById("down-payment").value) / 100;
  const interestRate =
    parseFloat(document.getElementById("interest-rate").value) / 100;

  if (isNaN(homePrice) || isNaN(downPayment) || isNaN(interestRate)) {
    document.getElementById("estimated-payment").textContent =
      "Please enter valid numbers.";
    return;
  }

  const loanAmount = homePrice * (1 - downPayment);
  const monthlyRate = interestRate / 12;
  const numberOfPayments = 30 * 12; // 30-year mortgage

  const monthlyPayment =
    (loanAmount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
  document.getElementById(
    "estimated-payment"
  ).textContent = `Your estimated payment is $${monthlyPayment.toFixed(
    2
  )} per month.`;
}

document
  .getElementById("home-price")
  .addEventListener("input", calculatePayment);
document
  .getElementById("down-payment")
  .addEventListener("input", calculatePayment);
document
  .getElementById("interest-rate")
  .addEventListener("input", calculatePayment);

document.getElementById("calc-btn").addEventListener("click", () => {
  openModal("calc-modal");
});
