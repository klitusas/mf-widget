export default class Widget {
    constructor(data = {}) {
        this.title = data.title;
        this.devices = data.device;
        this.periods = data.periods;
    }

    // get the data for widget
    getData() {
        return fetch('../../data/data.json')
            .then(function (response) {
                return response.json()
            })
            .catch(function (err) {
                console.log(err)
            })
    }
}
