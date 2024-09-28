class App {
    constructor() {
        this.clearButton = document.getElementById("clear-btn");
        this.loadButton = document.getElementById("load-btn");
        this.carContainerElement = document.getElementById("cars-container");
        this.driverType = document.getElementById("driver-type");
        this.pickupDate = document.getElementById("pickup-date");
        this.pickupTime = document.getElementById("pickup-time");
        this.passengerCount = document.getElementById("passenger-count");
    }

    async init() {
        await this.load();
        this.run();

        // Register click listener
        // this.clearButton.onclick = this.clear;
        // this.loadButton.onclick = this.run;

        // Add an event listener for each input to check the status of the load button.
        this.driverType.addEventListener('change', this.checkMandatoryFields);
        this.pickupDate.addEventListener('input', this.checkMandatoryFields);
        this.pickupTime.addEventListener('input', this.checkMandatoryFields);

        this.loadButton.addEventListener('click', async () => {
            if (!this.loadButton.disabled) {
                await this.loadFilter();
            }
        });
        this.clearButton.addEventListener('click', this.clear);
    }

    // Function to check field mandatory
    checkMandatoryFields = () => {
        const isDriverTypeFilled = this.driverType !== 'defaullt';
        const isPickupDateFilled = this.pickupDate !== '';
        const isPickupTimeFilled = this.pickupTime !== '';

        // If all mandatory fields are filled, enable the load button
        if (isDriverTypeFilled && isPickupDateFilled && isPickupTimeFilled) {
            this.loadButton.disabled = false;
        } else {
            this.loadButton.disabled = true;
        }
    };


    // Function for view the all cars
    run = () => {
        Car.list.forEach((car) => {
            const node = document.createElement("div");
            node.classList.add("col-lg-4", "my-2");
            node.innerHTML = car.render();
            this.carContainerElement.appendChild(node);
        });
    };

    async load() {
        const cars = await Binar.listCars();
        Car.init(cars);
        console.log(cars);
    }

    async loadFilter() {
        const cars = await Binar.listCars((data) => {
            const pickupDateTime = new Date(`${this.pickupDate.value} ${this.pickupTime.value}`).getTime();
            const availableAtTime = new Date(data.availableAt).getTime();
            const isTimeValid = availableAtTime >= pickupDateTime;
            const availableWithDriver = this.driverType.value === 'true' && data.available;
            const withoutDriver = this.driverType.value === 'false' && !data.available;
            const hasEnoughSeats = data.capacity >= this.passengerCount.value;

            // return (availableWithDriver || withoutDriver) && isTImeValid && hasEnoughSeats;

            if (this.driverType.value !== 'default' && this.pickupDate.value && this.pickupTime.value && this.passengerCount.value >= 0) {
                return (availableWithDriver || withoutDriver) && isTimeValid && hasEnoughSeats;
            } else if (this.driverType.value !== 'default' && this.passengerCount.value > 0) {
                return (availableWithDriver || withoutDriver) && hasEnoughSeats;
            } else if (this.pickupDate.value && this.pickupTime.value && this.passengerCount.value > 0) {
                return isTimeValid && hasEnoughSeats;
            } else if (this.pickupDate.value && this.pickupTime.value) {
                return isTimeValid;
            } else if (this.driverType.value !== 'default') {
                return availableWithDriver || withoutDriver;
            } else {
                return hasEnoughSeats;
            }
        });

        console.log(cars);
        Car.init(cars);
        this.run();
    }

    clear = () => {
        console.log("clear the button")
        let child = this.carContainerElement.firstElementChild;

        while (child) {
            child.remove();
            child = this.carContainerElement.firstElementChild;
        }
    };
}
