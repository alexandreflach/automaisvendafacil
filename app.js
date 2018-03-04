(function (win, document) {
  'use strict';

  function app() {
    var $companyName = new DOM('[data-js="company-name"]');
    var $companyFone = new DOM('[data-js="company-fone"]');
    var $formCarro = new DOM('[data-js="form-carro"]');
    var $inputImagem = new DOM('[data-js="url-imagem-carro"]');
    var $inputMarca = new DOM('[data-js="marca-modelo-carro"]');
    var $inputAno = new DOM('[data-js="ano-carro"]');
    var $inputPlaca = new DOM('[data-js="placa-carro"]');
    var $inputCor = new DOM('[data-js="cor-carro"]');
    var $inputCadastro = new DOM('[data-js="submit"]');
    var $tableCarro = new DOM('[data-js="lista-carro"]');
    var ajax = new XMLHttpRequest();
    var ajaxCars = new XMLHttpRequest();
    var ajaxPostCars = new XMLHttpRequest();
    var ajaxDeleteCars = new XMLHttpRequest();

    $formCarro.on('submit', handleSubmitForm);

    function handleSubmitForm(event) {
      event.preventDefault();
      cadastrar();
    }

    function cadastrar() {
      var car = {
        image: $inputImagem.get()[0].value,
        brandModel: $inputMarca.get()[0].value,
        year: $inputAno.get()[0].value,
        plate: $inputPlaca.get()[0].value,
        color: $inputCor.get()[0].value
      };

      ajaxPostCars.open('POST', 'http://localhost:3000/car');
      ajaxPostCars.setRequestHeader("Content-type", "application/json");
      ajaxPostCars.send(JSON.stringify(car));
      ajaxPostCars.addEventListener('readystatechange', handleReadyStateChangePostCar);
    }

    function remover(plate){

      ajaxPostCars.open('DELETE', 'http://localhost:3000/car');
      ajaxPostCars.setRequestHeader("Content-type", "application/json");
      ajaxPostCars.send(JSON.stringify({"plate": plate}));
      ajaxPostCars.addEventListener('readystatechange', handleReadyStateChangeDeleteCar);
    }

    function appendTdText(row, text) {
      var cell = document.createElement('td');
      var cellText = document.createTextNode(text);
      cell.appendChild(cellText);
      row.appendChild(cell);
      return cellText;
    }

    function appendTdButton(row, text, handle, plate) {
      var cell = document.createElement('td');
      var cellButton = document.createElement('button');
      cellButton.setAttribute('type', 'button');
      cellButton.addEventListener('click', handle);
      if(plate)
        cellButton.setAttribute('data-plate', plate);
      cellButton.innerText = text;
      cell.appendChild(cellButton);
      row.appendChild(cell);
      return cellButton;
    }

    function appendTdImage(row, src) {
      var cell = document.createElement('td');
      var cellImage = document.createElement('img');
      cellImage.setAttribute('src', src);
      cell.appendChild(cellImage);
      row.appendChild(cell);
      return cellImage;
    }

    function appendTdRectangle(row, color) {
      var cell = document.createElement('td');
      cell.style.backgroundColor = color;
      row.appendChild(cell);
      return cell;
    }

    function handleRemoverLinha(e){
      event.preventDefault();
      remover(e.target.getAttribute('data-plate'));
    }

    function carregar() {
      carregarCompany();
      carregarCarros();
    };

    function carregarCompany() {
      ajax.open('GET', 'company.json');
      ajax.send();
      ajax.addEventListener('readystatechange', handleReadyStateChange);
    };

    function carregarCarros() {
      ajaxCars.open('GET', 'http://localhost:3000/car');
      ajaxCars.send();
      ajaxCars.addEventListener('readystatechange', handleReadyStateChangeCar);
    };

    function handleReadyStateChange(func) {
      if (isRequestOk()) {
        fillCompany();
      }
    }

    function handleReadyStateChangeCar(func) {
      if (isRequestCarsOk()) {
        fillCars();
      }
    }

    function handleReadyStateChangePostCar(func) {
      if (isRequestPostCarsOk()) {
        carregarCarros();
      }
    }

    function handleReadyStateChangeDeleteCar(func) {
      if (isRequestDeleteCarsOk()) {
        carregarCarros();
      }
    }

    function fillCompany() {
      var data = parseData();
      if (!data) {
        data = getClearData();
      }

      $companyName.get()[0].textContent = data.name;
      $companyFone.get()[0].textContent = data.phone;
    }

    function fillCars(){
      $tableCarro.get()[0].innerHTML = '';

      var cars = parseDataCars();
      if(!cars)
        return;
      
      Array.prototype.forEach.call(cars, function(car){
        var row = document.createElement('tr');
        appendTdImage(row, car.image);
        appendTdText(row, car.brandModel);
        appendTdText(row, car.year);
        appendTdText(row, car.plate);
        appendTdRectangle(row, car.color);
        appendTdButton(row, 'Remover', handleRemoverLinha, car.plate);

        $tableCarro.get()[0].appendChild(row);
      });  
      
    }

    function isRequestOk() {
      return ajax.readyState === 4;
    }

    function isRequestCarsOk() {
      return ajaxCars.readyState === 4;
    }

    function isRequestPostCarsOk() {
      return ajaxPostCars.readyState === 4;
    }

    function isRequestDeleteCarsOk() {
      return ajaxDeleteCars.readyState === 4;
    }

    function parseData() {
      var result = null;
      try {
        result = JSON.parse(ajax.responseText);
      } catch (e) {
        result = null;
      }
      return result;
    }

    function parseDataCars() {
      var result = null;
      try {
        result = JSON.parse(ajaxCars.responseText);
      } catch (e) {
        result = null;
      }
      return result;
    }

    function getClearData() {
      return {
        name: "-",
        phone: "-"
      };
    }

    return {
      carregar: carregar,
      carrregarCarros: carregarCarros
    };
  }

  window.app = app();
  window.app.carregar();

})(window, document);
