import React, { useState, useEffect, useRef } from "react";
import Invoice from "../Invoice/Invoice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function InvoicePage() {
  const [selectedValue, setSelectedValue] = useState("USD");
  const [selectedTypeValue, setSelectedTypeValue] = useState("Invoice");
  const [buttonClass, setButtonClass] = useState(
    "opacity-50 cursor-not-allowed"
  );
  const [input1Value, setInput1Value] = useState("");
  const [input2Value, setInput2Value] = useState("");

  const currencyOptions = [
    { value: "AED", label: "AED (د.إ)" },
    { value: "AFN", label: "AFN" },
    { value: "ALL", label: "ALL (Lek)" },
    { value: "AMD", label: "AMD" },
    { value: "ANG", label: "ANG (ƒ)" },
    { value: "AOA", label: "AOA (Kz)" },
    { value: "ARS", label: "ARS ($)" },
    { value: "AUD", label: "AUD ($)" },
    { value: "AWG", label: "AWG (ƒ)" },
    { value: "AZN", label: "AZN (ман)" },
    { value: "BAM", label: "BAM (KM)" },
    { value: "BBD", label: "BBD ($)" },
    { value: "BDT", label: "BDT (Tk)" },
    { value: "BGN", label: "BGN (лв)" },
    { value: "BHD", label: "BHD" },
    { value: "BIF", label: "BIF" },
    { value: "BMD", label: "BMD ($)" },
    { value: "BND", label: "BND ($)" },
    { value: "BOB", label: "BOB ($b)" },
    { value: "BOV", label: "BOV" },
    { value: "BRL", label: "BRL (R$)" },
    { value: "BSD", label: "BSD ($)" },
    { value: "BTN", label: "BTN" },
    { value: "BWP", label: "BWP (P)" },
    { value: "BYN", label: "BYN (Br)" },
    { value: "BZD", label: "BZD (BZ$)" },
    { value: "CAD", label: "CAD ($)" },
    { value: "CDF", label: "CDF" },
    { value: "CHE", label: "CHE" },
    { value: "CHF", label: "CHF" },
    { value: "CHW", label: "CHW" },
    { value: "CLF", label: "CLF" },
    { value: "CLP", label: "CLP ($)" },
    { value: "CNY", label: "CNY (¥)" },
    { value: "COP", label: "COP (p.)" },
    { value: "COU", label: "COU" },
    { value: "CRC", label: "CRC (₡)" },
    { value: "CUC", label: "CUC" },
    { value: "CUP", label: "CUP (₱)" },
    { value: "CVE", label: "CVE" },
    { value: "CZK", label: "CZK (Kč)" },
    { value: "DJF", label: "DJF (CHF)" },
    { value: "DKK", label: "DKK (kr)" },
    { value: "DOP", label: "DOP (RD$)" },
    { value: "DZD", label: "DZD" },
    { value: "EGP", label: "EGP (E£)" },
    { value: "ERN", label: "ERN" },
    { value: "ETB", label: "ETB" },
    { value: "EUR", label: "EUR (€)" },
    { value: "FJD", label: "FJD ($)" },
    { value: "FKP", label: "FKP (£)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "GEL", label: "GEL" },
    { value: "GHS", label: "GHS (GH¢)" },
    { value: "GIP", label: "GIP (£)" },
    { value: "GMD", label: "GMD" },
    { value: "GNF", label: "GNF" },
    { value: "GTQ", label: "GTQ (Q)" },
    { value: "GYD", label: "GYD ($)" },
    { value: "HKD", label: "HKD (HK$)" },
    { value: "HNL", label: "HNL (L)" },
    { value: "HRK", label: "HRK (kn)" },
    { value: "HTG", label: "HTG" },
    { value: "HUF", label: "HUF (Ft)" },
    { value: "IDR", label: "IDR (Rp)" },
    { value: "ILS", label: "ILS (₪)" },
    { value: "INR", label: "INR (Rs)" },
    { value: "IQD", label: "IQD" },
    { value: "IRR", label: "IRR" },
    { value: "ISK", label: "ISK (kr)" },
    { value: "JMD", label: "JMD (J$)" },
    { value: "JOD", label: "JOD" },
    { value: "JPY", label: "JPY (¥)" },
    { value: "KES", label: "KES (KSh)" },
    { value: "KGS", label: "KGS (лв)" },
    { value: "KHR", label: "KHR (៛)" },
    { value: "KMF", label: "KMF" },
    { value: "KPW", label: "KPW (₩)" },
    { value: "KRW", label: "KRW (₩)" },
    { value: "KWD", label: "KWD (ك)" },
    { value: "KYD", label: "KYD ($)" },
    { value: "KZT", label: "KZT (лв)" },
    { value: "LAK", label: "LAK (₭)" },
    { value: "LBP", label: "LBP (£)" },
    { value: "LKR", label: "LKR (Rs)" },
    { value: "LRD", label: "LRD ($)" },
    { value: "LSL", label: "LSL" },
    { value: "LYD", label: "LYD (LD)" },
    { value: "MAD", label: "MAD" },
    { value: "MDL", label: "MDL" },
    { value: "MGA", label: "MGA" },
    { value: "MKD", label: "MKD (ден)" },
    { value: "MMK", label: "MMK" },
    { value: "MNT", label: "MNT (₮)" },
    { value: "MOP", label: "MOP" },
    { value: "MRU", label: "MRU" },
    { value: "MUR", label: "MUR (Rs)" },
    { value: "MVR", label: "MVR" },
    { value: "MWK", label: "MWK" },
    { value: "MXN", label: "MXN ($)" },
    { value: "MXV", label: "MXV" },
    { value: "MYR", label: "MYR (RM)" },
    { value: "MZN", label: "MZN (MT)" },
    { value: "NAD", label: "NAD (N$)" },
    { value: "NGN", label: "NGN (₦)" },
    { value: "NIO", label: "NIO (C$)" },
    { value: "NOK", label: "NOK (kr)" },
    { value: "NPR", label: "NPR (Rs)" },
    { value: "NZD", label: "NZD ($)" },
    { value: "OMR", label: "OMR" },
    { value: "PAB", label: "PAB (B/.)" },
    { value: "PEN", label: "PEN (S/.)" },
    { value: "PGK", label: "PGK" },
    { value: "PHP", label: "PHP (₱)" },
    { value: "PKR", label: "PKR (Rs)" },
    { value: "PLN", label: "PLN (zł)" },
    { value: "PYG", label: "PYG (Gs)" },
    { value: "QAR", label: "QAR" },
    { value: "RON", label: "RON (lei)" },
    { value: "RSD", label: "RSD (Дин.)" },
    { value: "RUB", label: "RUB (руб)" },
    { value: "RWF", label: "RWF" },
    { value: "SAR", label: "SAR" },
    { value: "SBD", label: "SBD ($)" },
    { value: "SCR", label: "SCR (Rs)" },
    { value: "SDG", label: "SDG" },
    { value: "SEK", label: "SEK (kr)" },
    { value: "SGD", label: "SGD ($)" },
    { value: "SHP", label: "SHP (£)" },
    { value: "SLL", label: "SLL" },
    { value: "SOS", label: "SOS (S)" },
    { value: "SRD", label: "SRD ($)" },
    { value: "SSP", label: "SSP" },
    { value: "STN", label: "STN" },
    { value: "SVC", label: "SVC ($)" },
    { value: "SYP", label: "SYP (£)" },
    { value: "SZL", label: "SZL" },
    { value: "THB", label: "THB (฿)" },
    { value: "TJS", label: "TJS" },
    { value: "TMT", label: "TMT" },
    { value: "TND", label: "TND (DT)" },
    { value: "TOP", label: "TOP" },
    { value: "TRY", label: "TRY" },
    { value: "TTD", label: "TTD (TT$)" },
    { value: "TWD", label: "TWD (NT$)" },
    { value: "TZS", label: "TZS (TSh)" },
    { value: "UAH", label: "UAH (₴)" },
    { value: "UGX", label: "UGX (USh)" },
    { value: "USD", label: "USD ($)" },
    { value: "USN", label: "USN" },
    { value: "UYI", label: "UYI" },
    { value: "UYU", label: "UYU ($U)" },
    { value: "UYW", label: "UYW" },
    { value: "UZS", label: "UZS (лв)" },
    { value: "VES", label: "VES" },
    { value: "VND", label: "VND (₫)" },
    { value: "VUV", label: "VUV" },
    { value: "WST", label: "WST" },
    { value: "XAF", label: "XAF" },
    { value: "XAG", label: "XAG" },
    { value: "XAU", label: "XAU" },
    { value: "XBA", label: "XBA" },
    { value: "XBB", label: "XBB" },
    { value: "XBC", label: "XBC" },
    { value: "XBD", label: "XBD" },
    { value: "XCD", label: "XCD ($)" },
    { value: "XDR", label: "XDR" },
    { value: "XOF", label: "XOF" },
    { value: "XPD", label: "XPD" },
    { value: "XPF", label: "XPF" },
    { value: "XPT", label: "XPT" },
    { value: "XSU", label: "XSU" },
    { value: "XTS", label: "XTS" },
    { value: "XUA", label: "XUA" },
    { value: "XXX", label: "XXX" },
    { value: "YER", label: "YER" },
    { value: "ZAR", label: "ZAR (R)" },
    { value: "ZMW", label: "ZMW (ZK)" },
    { value: "ZWL", label: "ZWL" },
  ];

  const typeOption = [
    "Invoice",
    "Credit Note",
    "Quote",
    "purchase Order",
    "Reciept",
  ];

  useEffect(() => {
    const storedInvoice = JSON.parse(localStorage.getItem("Invoice"));

    if (storedInvoice) {
      setSelectedValue(storedInvoice.Currency || "USD");
      setSelectedTypeValue(storedInvoice.Type || "Invoice");
    }
  }, []);

  const selectedCurrency = currencyOptions.find(
    (currency) => currency.value === selectedValue
  );

  const selectedCurrencyLabel = selectedCurrency ? selectedCurrency.label : "";
  const match = selectedCurrencyLabel.match(/\(([^)]+)\)/);
  let extractedText;
  if (match) {
    extractedText = match[1];
  } else {
    extractedText = selectedCurrencyLabel;
  }

  const handleSelectChange = (event) => {
    const selectedCurrency = event.target.value;
    const storedInvoice = {
      Currency: selectedCurrency,
      Type: selectedTypeValue,
    };
    localStorage.setItem("Invoice", JSON.stringify(storedInvoice));
    setSelectedValue(selectedCurrency);
  };

  const handleSelectTypeChange = (event) => {
    const selectedType = event.target.value;
    const storedInvoice = { Currency: selectedValue, Type: selectedType };
    localStorage.setItem("Invoice", JSON.stringify(storedInvoice));
    setSelectedTypeValue(selectedType);
  };

  function captureScreenshot() {
    const capture = document.querySelector(".invoice-template");
    html2canvas(capture).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
      pdf.save("invoice.pdf");
    });
  }

  const updateButtonOpacity = (input1Value, input2Value) => {
    const newButtonClass =
      input1Value === "" || input2Value === ""
        ? "opacity-50 cursor-not-allowed"
        : "opacity-100 cursor-pointer";
    setButtonClass(newButtonClass);
  };

  useEffect(() => {
    updateButtonOpacity(input1Value, input2Value);
  }, [input1Value, input2Value]);

  return (
    <div className="">
      <main className="custom-invoice-bg">
        <div className="mx-4 lg:mx-20 custom-grid py-12 px-4">
          <div className="captureElement">
            <Invoice
              currency={extractedText}
              updateButtonOpacity={updateButtonOpacity}
              input1Value={input1Value}
              setInput1Value={setInput1Value}
              input2Value={input2Value}
              setInput2Value={setInput2Value}
            />
          </div>
          <div className="down-sec pl-2 pt-2 tracking-widest">
            <button
              onClick={captureScreenshot}
              className={`md:flex items-center custom-button-download py-2 px-6 rounded text-white ${buttonClass}`}
            >
              <div className="px-1 text-xl">
                <ion-icon name="download-outline"></ion-icon>
              </div>
              <div className="text-lg tracking-wider">Download Invoice</div>
            </button>
            <div className="flex flex-col mt-8 lg:mt-4 -ml-2 lg:pl-3">
              <label
                htmlFor="currency"
                className="text-sm text-gray-500 font-semibold  pb-0.5 text-center lg:text-left"
              >
                CURRENCY
              </label>
              <select
                className="border-red-500 text-gray-500 custom-border-drop p-1 rounded h-50 "
                id="currency"
                value={selectedValue}
                onChange={handleSelectChange}
              >
                {currencyOptions.map((currency, index) => (
                  <option
                    className="text-gray-500"
                    key={index}
                    value={currency.value}
                  >
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-col mt-8 lg:mt-4 -ml-2 lg:pl-3 lg:flex hidden">
              <label
                htmlFor="type"
                className="text-sm text-gray-500 font-semibold pb-0.5"
              >
                TYPE
              </label>
              <select
                className="border-red-500 text-gray-500 custom-border-drop p-1 rounded h-50 "
                id="type"
                value={selectedTypeValue}
                onChange={handleSelectTypeChange}
              >
                {typeOption.map((type, index) => (
                  <option className="text-gray-500" key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="-ml-2 lg:ml-0 mt-8 lg:mt-4 lg:pl-1 cutom-save-defualt-color cursor-pointer text-base pb-4 text-center lg:text-left">
              Save Defaults
            </div>
            <div className="md:flex items-center justify-center lg:justify-start -ml-2 lg:ml-0 custom-line-color hidden">
              <button className="w-full flex items-center justify-center lg:justify-start gap-2 mt-8 lg:mt-4 mr-1 lg:pl-1 py-0.5 cursor-pointer text-xl cutom-history rounded text-gray-500 text-center lg:text-left">
                History
                <div className="flex items-center justify-center rounded-full h-5 w-5 bg-red-500 text-white">
                  1
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
      <div
        className="z-20 fixed bottom-0 left-0 w-full flex py-4 px-8 items-center justify-between bg-templatehistorytext md:hidden"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
      >
        <button className="flex items-center gap-2 px-4 py-1 text-xl cutom-history rounded text-gray-500">
          History
          <div className="flex items-center justify-center rounded-full h-5 w-5 bg-red-500 text-white">
            1
          </div>
        </button>
        <button
          onClick={captureScreenshot}
          className={`${buttonClass} flex items-center custom-button-download py-1 px-4 rounded text-white`}
        >
          <div className="px-1 text-xl">
            <ion-icon name="download-outline"></ion-icon>
          </div>
          <div className="text-lg tracking-wider">Download</div>
        </button>
      </div>
    </div>
  );
}

export default InvoicePage;
