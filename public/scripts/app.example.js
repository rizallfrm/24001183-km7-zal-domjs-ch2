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
    }

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
    }

    clear = () => {
        let child = this.carContainerElement.firstElementChild;

        while (child) {
            child.remove();
            child = this.carContainerElement.firstElementChild;
        }
    };
}
