import React, { useState, useEffect } from "react";
import Input from "../Input/Input";

function Invoice({
  currency,
  input1Value,
  setInput1Value,
  input2Value,
  setInput2Value,
  updateButtonOpacity,
}) {
  const storedInvoice = JSON.parse(localStorage.getItem("Invoice")) || {};

  const [finalTotal, setFinalTotal] = useState(
    storedInvoice["InvoiceTotal"] || "0"
  );

  const [lastFinalTotal, setLastFinalTotal] = useState(() => {
    const initialAmountPaidValue = storedInvoice["InvoiceAmountPaidValue"] || 0;
    const calculatedTotal =
      parseFloat(finalTotal) - parseFloat(initialAmountPaidValue);
    const totalToShow = isNaN(calculatedTotal)
      ? parseFloat(finalTotal)
      : calculatedTotal;
    const totalToShowString = parseFloat(totalToShow).toFixed(2);
    return `${currency} ${totalToShowString}`;
  });

  const [logoImage, setLogoImage] = useState(null);

  const [lineItems, setLineItems] = useState(() => {
    const storedInvoice = JSON.parse(localStorage.getItem("Invoice")) || {};
    const initialLineItems = [];
    let index = 0;
    while (storedInvoice[`lineItem-description-${index}`] !== undefined) {
      initialLineItems.push({
        description: storedInvoice[`lineItem-description-${index}`] || "",
        quantity: storedInvoice[`lineItem-quantity-${index}`] || "0",
        price: storedInvoice[`lineItem-price-${index}`] || "0",
      });
      index++;
    }
    if (initialLineItems.length === 0) {
      initialLineItems.push({
        description: "",
        quantity: "0",
        price: "0",
      });
    }
    return initialLineItems;
  });

  const [totalAmount, setTotalAmount] = useState(0);

  const addToLocal = (updatedPaymentTotal) => {
    const updatedInvoice = {
      ...storedInvoice,
      paymentTotal: updatedPaymentTotal,
    };
    localStorage.setItem("Invoice", JSON.stringify(updatedInvoice));
  };

  const getPaymentTotalFromLocalStorage = () => {
    const storedLine = storedInvoice["lineItem-description-0"];
    if (storedLine === undefined) {
      const updatedInvoice = {
        ...storedInvoice,
        "lineItem-description-0": "",
        "lineItem-quantity-0": "0",
        "lineItem-price-0": "0",
      };
      localStorage.setItem("Invoice", JSON.stringify(updatedInvoice));
    }

    const storedPaymentTotal = storedInvoice.paymentTotal || [];
    if (storedPaymentTotal.length === 0) {
      const defaultPaymentTotal = [
        {
          name: "Discount",
          initialvalue: true,
          visible: false,
          otherInput: {
            name: "DiscountVal",
            initialvalue: true,
            focus: true,
            swap: false,
            addrightPadding: true,
          },
        },
        {
          name: "Tax",
          initialvalue: true,
          visible: true,
          otherInput: {
            name: "TaxVal",
            initialvalue: true,
            focus: true,
            swap: false,
            addrightPadding: true,
          },
        },
        {
          name: "Shipping",
          initialvalue: true,
          visible: false,
          otherInput: {
            name: "ShippingVal",
            initialvalue: true,
            focus: true,
            alignment: "left",
            addLeftPadding: true,
          },
        },
      ];
      addToLocal(defaultPaymentTotal);
      return defaultPaymentTotal;
    } else {
      return storedPaymentTotal;
    }
  };

  const [paymentTotal, setPaymentTotal] = useState(
    getPaymentTotalFromLocalStorage()
  );

  useEffect(() => {
    const storedInvoice = JSON.parse(localStorage.getItem("Invoice"));
    if (storedInvoice) {
      if (storedInvoice.logoImage) {
        setLogoImage(storedInvoice.logoImage);
      }
    }
  }, []);

  useEffect(() => {
    calculateFinalTotal();
  }, [totalAmount, paymentTotal]);

  useEffect(() => {
    const updatedInvoice = {
      ...storedInvoice,
      paymentTotal,
    };
    localStorage.setItem("Invoice", JSON.stringify(updatedInvoice));
  }, [paymentTotal]);

  const handleButtonClick = (label) => {
    const updatedPaymentTotal = paymentTotal.map((item) => {
      if (item.name === label) {
        return { ...item, visible: true };
      }
      return item;
    });
    setPaymentTotal(updatedPaymentTotal);
    addToLocal(updatedPaymentTotal);
  };

  const removeField = (index, name) => {
    const updatedPaymentTotal = paymentTotal.map((item) => {
      if (item.name === name) {
        return { ...item, visible: false };
      }
      return item;
    });
    setPaymentTotal(updatedPaymentTotal);
    addToLocal(updatedPaymentTotal);
  };

  const handleSwapClick = (name) => {
    const updatedPaymentTotal = paymentTotal.map((item) => {
      if (item.otherInput.name === name) {
        return {
          ...item,
          otherInput: { ...item.otherInput, swap: !item.otherInput.swap },
        };
      }
      return item;
    });
    setPaymentTotal(updatedPaymentTotal);
    addToLocal(updatedPaymentTotal);
  };

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoImage(e.target.result);
        const storedInvoice = JSON.parse(localStorage.getItem("Invoice")) || {};
        storedInvoice.logoImage = e.target.result;
        localStorage.setItem("Invoice", JSON.stringify(storedInvoice));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const clearImage = () => {
    setLogoImage(null);
    const storedInvoice = JSON.parse(localStorage.getItem("Invoice")) || {};
    delete storedInvoice.logoImage;
    localStorage.setItem("Invoice", JSON.stringify(storedInvoice));
  };

  const addLineItem = () => {
    const newLineItem = {
      description: "",
      quantity: "0",
      price: "0",
    };

    const updatedInvoice = { ...storedInvoice };
    const newIndex = lineItems.length;
    updatedInvoice[`lineItem-description-${newIndex}`] =
      newLineItem.description;
    updatedInvoice[`lineItem-quantity-${newIndex}`] = newLineItem.quantity;
    updatedInvoice[`lineItem-price-${newIndex}`] = newLineItem.price;
    localStorage.setItem("Invoice", JSON.stringify(updatedInvoice));
    setLineItems((prevLineItems) => [...prevLineItems, newLineItem]);
  };

  const removeLineItem = (index) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems.splice(index, 1);

    const updatedInvoice = { ...storedInvoice };
    delete updatedInvoice[`lineItem-description-${index}`];
    delete updatedInvoice[`lineItem-quantity-${index}`];
    delete updatedInvoice[`lineItem-price-${index}`];

    localStorage.setItem("Invoice", JSON.stringify(updatedInvoice));
    setLineItems(updatedLineItems);
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.querySelector(".close-icon").classList.add("opacity-100");
    if (window.innerWidth >= 768) {
      if (lineItems.length > 1) {
        e.currentTarget
          .querySelector(".close-icon")
          .classList.remove("md:opacity-0");
      }
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget
      .querySelector(".close-icon")
      .classList.remove("md:opacity-100");
    if (window.innerWidth >= 768) {
      e.currentTarget
        .querySelector(".close-icon")
        .classList.add("md:opacity-0");
    }
  };

  useEffect(() => {
    recalculateTotal();
  }, [lineItems]);

  const handleChange = (index, name, item) => {
    storedInvoice[`lineItem-${name}-${index}`] = item;
    localStorage.setItem("Invoice", JSON.stringify(storedInvoice));
    localStorage.setItem(`lineItem-${name}-${index}`, item);
    recalculateTotal();
  };

  const recalculateTotal = () => {
    let total = 0;
    lineItems.forEach((lineItem, index) => {
      const quantityFromStorage = localStorage.getItem(
        `lineItem-quantity-${index}`
      );
      const quantity = parseFloat(quantityFromStorage) || +0;
      const priceFromStorage = localStorage.getItem(`lineItem-price-${index}`);
      const price = parseFloat(priceFromStorage) || +0;
      total += quantity * price;
      const lineItemTotal = parseFloat(quantity) * parseFloat(price);

      const stored = JSON.parse(localStorage.getItem("Invoice")) || {};
      stored[`lineItem-total-${index}`] = lineItemTotal;
      localStorage.setItem("Invoice", JSON.stringify(stored));
    });
    console.log(total);
    setTotalAmount(total.toFixed(2));
  };

  const calculateFinalTotal = () => {
    const storedInvoice2 = JSON.parse(localStorage.getItem("Invoice"));

    let total = parseFloat(totalAmount);
    paymentTotal.forEach((item) => {
      if (item.visible) {
        if (item.name === "Tax" && !item.otherInput.swap) {
          total +=
            (total * parseFloat(storedInvoice2["Invoice-TaxVal"])) / 100 || 0;
        } else if (item.name === "Discount" && !item.otherInput.swap) {
          total -=
            (total * parseFloat(storedInvoice2["Invoice-DiscountVal"])) / 100 ||
            0;
        }
        if (item.name === "Shipping" && !item.otherInput.swap) {
          total += parseFloat(storedInvoice2["Invoice-ShippingVal"]) || 0;
        }
        if (item.otherInput.swap) {
          total +=
            parseFloat(storedInvoice2[`Invoice-${item.otherInput.name}`]) || 0;
        }
      }
    });
    setFinalTotal(total.toFixed(2));
    setLastFinalTotal(total.toFixed(2));
  };

  const handleInputChange = (fieldName, value) => {
    const updatedInvoice = {
      ...storedInvoice,
      [`Invoice-${fieldName}`]: value,
    };
    localStorage.setItem("Invoice", JSON.stringify(updatedInvoice));
    calculateFinalTotal();
  };

  const handleInputFinalChange = (e) => {
    const fieldName = "InvoiceAmountPaidValue";
    const updatedInvoice = {
      ...storedInvoice,
      [fieldName]: e,
    };
    localStorage.setItem("Invoice", JSON.stringify(updatedInvoice));
    const newLastFinalTotal = `${currency} ${(
      parseFloat(finalTotal) - parseFloat(e || 0)
    ).toFixed(2)}`;
    setLastFinalTotal(newLastFinalTotal);
  };

  return (
    <div className="relative ml-2 lg:mr-2 mt-2">
      <div className="w-full h-full p-5 border-r border-b border-gray-300 absolute bg-white shadow-md bottom-1 right-1"></div>
      <div className="w-full h-full p-5 border-r border-b border-gray-300 absolute bg-white shadow-md bottom-2 right-2"></div>
      <div className="w-full h-full p-5 border border-gray-300 bg-white shadow-md bottom-2 right-2 ">
        <div className="relative md:grid md:grid-cols-2 md:grid-rows-2 grid-cols-1">
          <div className="md:pr-6 justify-end md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-2">
            <Input
              fontSize="2.8rem"
              color="#232e38"
              width="100%"
              height="50px"
              alignment="text-left md:text-right"
              type="text"
              initialValue={storedInvoice["InvoiceTitle"] || "INVOICE"}
              invoiceKey="InvoiceTitle"
            />
            <div className="mb-4 md:mr-3 md:mb-0 flex w-48 md:ml-auto items-center relative">
              <span className="absolute z-10 -md:-left-2 bottom-0 w-10 h-9 flex items-center py-2.5 px-3 outline-1 outline-gray-200 border border-gray-200 rounded-tl-md rounded-bl-md bg-gray-200">
                #
              </span>
              <input className="custom-focus-outline text-left md:text-right flex-1 shadow-none bg-white text-lg rounded-tr-md rounded-br-md outline outline-gray-200 rounded outline-2 px-3 py-1" />
            </div>
          </div>
          <div className="md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-3">
            <div
              className={`relative h-14 md:h-28 w-56 flex text-gray-400 font-normal cursor-pointer ${
                logoImage
                  ? "overflow-hidden justify-start"
                  : "bg-gray-200 border border-gray-300 items-center justify-center"
              }`}
            >
              {logoImage ? (
                <>
                  <img
                    src={logoImage}
                    alt="Your Logo"
                    className="h-full object-contain "
                  />
                  <div
                    onClick={clearImage}
                    className="absolute h-6 w-6 top-0 left-0 p-1 bg-gray-800 rounded text-gray-400 cursor-pointer"
                  >
                    <ion-icon name="close-outline"></ion-icon>
                  </div>
                </>
              ) : (
                <>
                  <label
                    htmlFor="logoInput"
                    className="w-full h-full flex items-center justify-center cursor-pointer"
                  >
                    <ion-icon
                      name="add-outline"
                      className="text-3xl mb-2"
                    ></ion-icon>
                    Add Your Logo
                  </label>
                  <input
                    id="logoInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </>
              )}
            </div>
            <Input
              fontSize="1rem"
              color="#232e38"
              width="80%"
              height="60px"
              placeholder="who is this invoice from? (required)"
              alignment="left"
              type="textarea"
              focus={true}
              initialValue={storedInvoice["InvoiceFrom"]}
              invoiceKey="InvoiceFrom"
              onChange={(newValue) => {
                setInput1Value(newValue);
                updateButtonOpacity(newValue, input2Value);
              }}
            />

            <div className="w-full flex flex-col md:flex-row ">
              <div className="md:w-6/12 flex flex-col">
                <Input
                  fontSize="1rem"
                  color="#737577"
                  width="70%"
                  height="20px"
                  alignment="left"
                  type="text"
                  initialValue={storedInvoice["InvoiceBillTo"] || "Bill To"}
                  invoiceKey="InvoiceBillTo"
                />
                <div className="-mt-2">
                  <Input
                    fontSize="1rem"
                    color="#232e38"
                    width="95%"
                    height="60px"
                    placeholder="who is this invoice to? (required)"
                    alignment="left"
                    initialValue={storedInvoice["WhoInvoiceTo"]}
                    invoiceKey="WhoInvoiceTo"
                    type="textarea"
                    focus={true}
                    onChange={(newValue) => {
                      setInput2Value(newValue);
                      updateButtonOpacity(input1Value, newValue);
                    }}
                  />
                </div>
              </div>
              <div className="md:w-6/12 flex flex-col">
                <Input
                  fontSize="1rem"
                  color="#737577"
                  width="70%"
                  height="20px"
                  alignment="left"
                  initialValue={storedInvoice["InvoiceShipTo"] || "Ship To"}
                  invoiceKey="InvoiceShipTo"
                  type="text"
                />
                <div className="-mt-2">
                  <Input
                    fontSize="1rem"
                    color="#232e38"
                    width="95%"
                    height="60px"
                    placeholder="(optional)"
                    alignment="left"
                    initialValue={storedInvoice["InvoiceTypedShipTo"]}
                    invoiceKey="InvoiceTypedShipTo"
                    type="textarea"
                    focus={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="md:pr-6 md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3">
            <div className="flex gap-2 -mt-3">
              <Input
                fontSize="1rem"
                color="#737577"
                width="100%"
                height="30px"
                alignment="text-right"
                initialValue={storedInvoice["InvoiceDate"] || "Date"}
                invoiceKey="InvoiceDate"
                type="text"
              />
              <Input
                fontSize="1rem"
                color="#232e38"
                width="9.3rem"
                height="30px"
                initialValue={storedInvoice["InvoiceSelectedDate"]}
                invoiceKey="InvoiceSelectedDate"
                type="date"
                focus={true}
              />
            </div>
            <div className="flex gap-2 -mt-4">
              <Input
                fontSize="1rem"
                color="#737577"
                width="100%"
                height="30px"
                alignment="text-right"
                initialValue={
                  storedInvoice["InvoicePaymentTerms"] || "Payment Terms"
                }
                invoiceKey="InvoicePaymentTerms"
                type="text"
              />
              <Input
                fontSize="1rem"
                color="#232e38"
                width="9.3rem"
                height="30px"
                alignment="text-right"
                initialValue={storedInvoice["InvoiceSelectedPaymentTerms"]}
                invoiceKey="InvoiceSelectedPaymentTerms"
                type="text"
                focus={true}
              />
            </div>
            <div className="flex gap-2 -mt-4">
              <Input
                fontSize="1rem"
                color="#737577"
                width="100%"
                height="30px"
                alignment="text-right"
                initialValue={storedInvoice["InvoiceDueDate"] || "Due Date"}
                invoiceKey="InvoiceDueDate"
                type="text"
              />
              <Input
                fontSize="1rem"
                color="#232e38"
                width="9.3rem"
                height="30px"
                initialValue={storedInvoice["InvoiceSelectedDueDate"]}
                invoiceKey="InvoiceSelectedDueDate"
                type="date"
                focus={true}
              />
            </div>
            <div className="flex gap-2 -mt-4">
              <Input
                fontSize="1rem"
                color="#737577"
                width="100%"
                height="30px"
                alignment="text-right"
                initialValue={storedInvoice["InvoicePONumber"] || "PO Number"}
                invoiceKey="InvoicePONumber"
                type="text"
              />
              <Input
                fontSize="1rem"
                color="#232e38"
                width="9.3rem"
                height="30px"
                alignment="text-right"
                initialValue={storedInvoice["InvoiceSelectedPONumber"]}
                invoiceKey="InvoiceSelectedPONumber"
                type="text"
                focus={true}
              />
            </div>
          </div>
        </div>
        <div className="relative md:pr-6 md:mt-4">
          <div className="hidden md:flex gap-1.5 h-9 w-full custom-navbar-bg rounded items-center">
            <div className="w-5/6">
              <Input
                fontSize="1rem"
                color="#fff"
                bg={true}
                width="100%"
                height="30px"
                alignment="text-left"
                initialValue={storedInvoice["InvoiceItem"] || "Item"}
                invoiceKey="InvoiceItem"
                type="text"
                tableFocus={true}
              />
            </div>
            <div className="w-1/6">
              <Input
                fontSize="1rem"
                color="#fff"
                bg={true}
                width="100%"
                height="30px"
                alignment="text-left"
                initialValue={storedInvoice["InvoiceQuantity"] || "Quantity"}
                invoiceKey="InvoiceQuantity"
                type="text"
                tableFocus={true}
              />
            </div>
            <div className="w-1/4">
              <Input
                fontSize="1rem"
                color="#fff"
                bg={true}
                width="100%"
                height="30px"
                alignment="text-left"
                initialValue={storedInvoice["InvoiceRate"] || "Rate"}
                invoiceKey="InvoiceRate"
                type="text"
                tableFocus={true}
              />
            </div>
            <div className="w-1/6">
              <Input
                fontSize="1rem"
                color="#fff"
                bg={true}
                width="100%"
                height="30px"
                alignment="text-right"
                initialValue={storedInvoice["InvoiceAmount"] || "Amount"}
                invoiceKey="InvoiceAmount"
                type="text"
                tableFocus={true}
              />
            </div>
          </div>
          {lineItems.map((lineItem, index) => {
            const lineItemTotal = storedInvoice[`lineItem-total-${index}`] || 0;
            return (
              <div
                key={index}
                className="border border-gray-200 md:border-none px-4 pt-4 pb-2 md:pt-0 md:pb-0 md:px-0 md:h-10 w-full my-1 rounded flex md:items-center relative flex-col-reverse md:flex-row"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-full md:w-5/6 pr-2">
                  <Input
                    fontSize="1rem"
                    color="#232e38"
                    width="100%"
                    height="30px"
                    alignment="text-left"
                    initialValue={
                      storedInvoice[`lineItem-description-${index}`] ||
                      `${lineItem.description}`
                    }
                    invoiceKey={`lineItem-description-${index}`}
                    type="text"
                    focus={true}
                    placeholder="Description of service or product..."
                  />
                </div>
                {window.innerWidth < 768 ? (
                  <div className="flex items-center md:flex-row-reverse">
                    <div className="relative w-2/5 md:w-full pr-2 flex items-center">
                      <div className="text-gray-500 z-10 absolute left-4 top-4.5">
                        {currency}
                      </div>
                      <Input
                        fontSize="1rem"
                        color="#232e38"
                        width="100%"
                        height="30px"
                        alignment="text-left"
                        initialValue={
                          storedInvoice[`lineItem-price-${index}`] ||
                          `${lineItem.price}`
                        }
                        type="number"
                        invoiceKey={`lineItem-price-${index}`}
                        focus={true}
                        addLeftPadding={true}
                        onChange={(p) => handleChange(index, "price", p)}
                        required={true}
                      />
                    </div>
                    <div className="relative md:hidden p-2 md:p-0">
                      <ion-icon name="close-outline"></ion-icon>
                    </div>
                    <div className="w-2/6 md:w-full pr-2">
                      <Input
                        fontSize="1rem"
                        color="#232e38"
                        width="100%"
                        height="30px"
                        alignment="text-left"
                        initialValue={
                          storedInvoice[`lineItem-quantity-${index}`] ||
                          `${lineItem.quantity}`
                        }
                        invoiceKey={`lineItem-quantity-${index}`}
                        type="number"
                        focus={true}
                        placeholder="Quantity"
                        required={true}
                        onChange={(q) => handleChange(index, "quantity", q)}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-1/6 pr-2">
                      <Input
                        fontSize="16px"
                        color="#232e38"
                        width="100%"
                        height="30px"
                        alignment="text-left"
                        initialValue={
                          storedInvoice[`lineItem-quantity-${index}`] ||
                          `${lineItem.quantity}`
                        }
                        invoiceKey={`lineItem-quantity-${index}`}
                        type="number"
                        required={true}
                        focus={true}
                        placeholder="Quantity"
                        onChange={(newQuantity) =>
                          handleChange(index, "quantity", newQuantity)
                        }
                      />
                    </div>
                    <div className="relative w-1/4 pr-2 flex items-center">
                      <div className="text-gray-500 z-10 absolute left-4 top-5">
                        {currency}
                      </div>
                      <Input
                        fontSize="16px"
                        color="#232e38"
                        width="100%"
                        height="30px"
                        alignment="text-left"
                        initialValue={
                          storedInvoice[`lineItem-price-${index}`] ||
                          `${lineItem.price}`
                        }
                        required={true}
                        invoiceKey={`lineItem-price-${index}`}
                        type="number"
                        focus={true}
                        addLeftPadding={true}
                        onChange={(newPrice) =>
                          handleChange(index, "price", newPrice)
                        }
                      />
                    </div>
                  </>
                )}

                <div className="w-full md:w-1/6 pr-3 flex md:justify-end">
                  <div className="text-right text-gray-400 md:hidden">
                    Amount:
                  </div>
                  <div className="text-right text-gray-500 pointer-events-none cursor-not-allowed">
                    &nbsp;&nbsp;{currency} {lineItemTotal}
                  </div>
                </div>
                <div
                  onClick={() => {
                    if (lineItems.length !== 1) {
                      removeLineItem(index);
                    }
                  }}
                  className="close-icon absolute md:-right-6 cursor-pointer md:opacity-0 transition-opacity duration-300 top-2.5 right-3"
                >
                  <ion-icon
                    className="text-gray-500"
                    name="close-outline"
                    style={{ fontSize: "20px" }}
                  ></ion-icon>
                </div>
              </div>
            );
          })}
          <button
            onClick={addLineItem}
            className="flex items-center custom-button-download py-1 px-2 rounded text-white"
          >
            <div className="pt-1 pr-1 text-base">
              <ion-icon name="add-outline"></ion-icon>
            </div>
            <div className="text-sm tracking-wider">Line Item</div>
          </button>
        </div>
        <div className="relative mt-10 grid gap-2 md:grid-cols-2 grid-col-1">
          <div className="md:col-start-1 md:col-end-2">
            <Input
              fontSize="1rem"
              color="#737577"
              width="60%"
              height="20px"
              alignment="left"
              initialValue={storedInvoice["InvoiceNotes"] || "Notes"}
              invoiceKey="InvoiceNotes"
              type="text"
            />
            <Input
              fontSize="1rem"
              color="#232e38"
              width="100%"
              height="60px"
              placeholder="Notes - any relevant information not ready coverd"
              alignment="left"
              initialValue={storedInvoice["InvoiceTypedNotes"]}
              invoiceKey="InvoiceTypedNotes"
              type="textarea"
              focus={true}
            />
            <Input
              fontSize="1rem"
              color="#737577"
              width="60%"
              height="20px"
              alignment="left"
              initialValue={storedInvoice["InvoiceTerms"] || "Terms"}
              invoiceKey="InvoiceTerms"
              type="text"
            />
            <Input
              fontSize="1rem"
              color="#232e38"
              width="100%"
              height="60px"
              placeholder="Terms and conditions - late fees, payment methods, delivery schedules"
              alignment="left"
              initialValue={storedInvoice["InvoiceTypedTerms"]}
              invoiceKey="InvoiceTypedTerms"
              type="textarea"
              focus={true}
            />
          </div>
          <div className="w-full md:col-start-2 md:col-end-3 pr-6">
            <div className="flex gap-2 items-center">
              <Input
                fontSize="1rem"
                color="#737577"
                width="100%"
                height="30px"
                alignment="text-right"
                initialValue={storedInvoice["InvoiceSubtotals"] || "Subtotals"}
                invoiceKey="InvoiceSubtotals"
                type="text"
              />
              <Input
                fontSize="1rem"
                color="#232e38"
                width="9.3rem"
                height="30px"
                alignment="text-right"
                initialValue={`${currency} ${totalAmount}`}
                type="text"
                restrict={true}
              />
            </div>
            {paymentTotal.map(
              (item, index) =>
                item.visible && (
                  <div
                    key={index}
                    className="flex gap-2 -mt-4 relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Input
                      fontSize="1rem"
                      color="#737577"
                      width="100%"
                      height="30px"
                      alignment="text-right"
                      initialValue={item.name}
                      type="text"
                    />
                    {item.otherInput &&
                      (item.otherInput.name === "ShippingVal" ? (
                        <div className="relative flex items-center">
                          <div className="text-gray-500 z-10 absolute left-4 top-4.5">
                            {currency}
                          </div>
                          <Input
                            fontSize="1rem"
                            color="#232e38"
                            width="9.3rem"
                            height="30px"
                            alignment="text-left"
                            initialValue={storedInvoice["InvoiceShipping"]}
                            invoiceKey="InvoiceShipping"
                            type="number"
                            focus={true}
                            addLeftPadding={true}
                            useFinalOnChange={true}
                            onChangeFinal={(value) => {
                              handleInputChange("ShippingVal", value);
                            }}
                          />
                        </div>
                      ) : item.otherInput.swap ? (
                        <div className="relative flex items-center">
                          <div className="text-gray-500 z-10 absolute left-4 top-4.5">
                            {currency}
                          </div>
                          <Input
                            fontSize="1rem"
                            color="#232e38"
                            width="9.3rem"
                            height="30px"
                            alignment="text-left"
                            initialValue={
                              storedInvoice[`Invoice-${item.otherInput.name}`]
                            }
                            invoiceKey={`Invoice-${item.otherInput.name}`}
                            type="number"
                            focus={true}
                            addLeftPadding={true}
                            addrightPadding={true}
                            useFinalOnChange={true}
                            onChangeFinal={(value) => {
                              handleInputChange(item.otherInput.name, value);
                            }}
                          />
                          <div
                            className="text-gray-600 absolute right-2 top-5 cursor-pointer"
                            onClick={() =>
                              handleSwapClick(item.otherInput.name)
                            }
                          >
                            <ion-icon name="git-compare-outline"></ion-icon>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Input
                            fontSize="1rem"
                            color="#232e38"
                            width="9.3rem"
                            height="30px"
                            alignment="text-right"
                            initialValue={
                              storedInvoice[`Invoice-${item.otherInput.name}`]
                            }
                            invoiceKey={`Invoice-${item.otherInput.name}`}
                            type="number"
                            focus={item.otherInput.focus}
                            addrightPadding={item.otherInput.addrightPadding}
                            useFinalOnChange={true}
                            onChangeFinal={(value) => {
                              handleInputChange(item.otherInput.name, value);
                            }}
                          />
                          <div className="text-gray-600 absolute right-7 top-5">
                            %
                          </div>
                          <div
                            className="text-gray-600 absolute right-2 top-5 cursor-pointer"
                            onClick={() =>
                              handleSwapClick(item.otherInput.name)
                            }
                          >
                            <ion-icon name="git-compare-outline"></ion-icon>
                          </div>
                        </>
                      ))}
                    <div
                      onClick={() => removeField(index, item.name)}
                      className="close-icon absolute -right-6 top-4 cursor-pointer md:opacity-0 transition-opacity duration-300"
                    >
                      <ion-icon
                        name="close-outline"
                        style={{ fontSize: "20px" }}
                      ></ion-icon>
                    </div>
                  </div>
                )
            )}
            <div className="relative flex justify-end gap-4">
              {paymentTotal.map(
                (item, index) =>
                  !item.visible && (
                    <button
                      key={index}
                      className={`flex gap-3 cutom-save-defualt-color hover:backdrop-saturate-200`}
                      onClick={() => handleButtonClick(item.name)}
                    >
                      <div>
                        <ion-icon name="add-outline"></ion-icon>
                      </div>
                      {item.name}
                    </button>
                  )
              )}
            </div>
            <div className="flex gap-2 items-center -mt-2">
              <Input
                fontSize="1rem"
                color="#737577"
                width="100%"
                height="30px"
                alignment="text-right"
                initialValue={storedInvoice["InvoiceTotalTitle"] || "Total"}
                invoiceKey="InvoiceTotalTitle"
                type="text"
              />
              <Input
                fontSize="1rem"
                color="#232e38"
                width="9.3rem"
                height="30px"
                alignment="text-right"
                initialValue={`${currency} ${finalTotal}`}
                type="text"
                restrict={true}
              />
            </div>
            <div className="flex gap-2 items-center -mt-4">
              <Input
                fontSize="1rem"
                color="#737577"
                width="100%"
                height="30px"
                alignment="text-right"
                initialValue={
                  storedInvoice["InvoiceAmountPaid"] || "Amount Paid"
                }
                invoiceKey="InvoiceAmountPaid"
                type="text"
              />
              <div className="relative flex items-center">
                <div className="text-gray-500 z-10 absolute left-4 top-4.5">
                  {currency}
                </div>
                <Input
                  fontSize="1rem"
                  color="#232e38"
                  width="9.3rem"
                  height="30px"
                  alignment="text-left"
                  initialValue={storedInvoice["InvoiceAmountPaidValue"]}
                  invoiceKey="InvoiceAmountPaidValue"
                  type="number"
                  focus={true}
                  addLeftPadding={true}
                  onChange={(e) => {
                    handleInputFinalChange(e);
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2 items-center -mt-4">
              <Input
                fontSize="1rem"
                color="#737577"
                width="100%"
                height="30px"
                alignment="text-right"
                initialValue={
                  storedInvoice["InvoiceBalanceDue"] || "Balance Due"
                }
                invoiceKey="InvoiceBalanceDue"
                type="text"
              />
              <Input
                fontSize="1rem"
                color="#232e38"
                width="9.3rem"
                height="30px"
                alignment="text-right"
                initialValue={`${lastFinalTotal}`}
                type="text"
                restrict={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
