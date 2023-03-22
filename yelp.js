import { LightningElement, track, api, wire } from 'lwc';
import getYelpApi from '@salesforce/apex/yelpContoller.getYelpApi';
import getAddress from '@salesforce/apex/yelpContoller.getAddress';



export default class Yelp extends LightningElement {
    @api recordId;
    yelpResults;
    @track mapMarkers = [];
    street;
    city;
    state;
    name = '';
    @track center = '';

    loadAccounts() {
        getAddress({ idName: this.recordId })
            .then((data) => {
               
                this.street = String(data[0].ShippingStreet)
                this.city = String(data[0].ShippingCity)
                this.state = String(data[0].ShippingState)
                this.yelpCall();
            })
            .catch((error) => {
                console.log(error);
            });
    }



    connectedCallback() {
        this.loadAccounts()
        var newMarker = [];

        newMarker = {
            location: {
                Street: this.street,
                City: this.city,
                Country: 'USA',
            },
            title: this.name,
        }
        this.mapMarkers = [...this.mapMarkers, newMarker];
        this.center = {
            location: {
                Street: this.street,
                City: this.city
            }
        };


    }

    yelpCall() {
        var newMapMarker = [];
        var descCategory = '';
        getYelpApi({ street: this.street, city: this.city, state: this.state })
            .then(result => {
                this.yelpResults = JSON.parse(result);
                this.yelpResults.businesses.forEach(element => {
                    descCategory = '';
                    element.categories.forEach(el => {
                        descCategory += `${el.title}<br> `;
                    })
                    console.log('Business: ', element.name);
                    newMapMarker = {
                        location: {
                            Street: element.location.address1,
                            City: element.location.city,
                            Country: 'USA',
                            Latitude: element.coordinates.latitude,
                            Longitude: element.coordinates.longitude,
                        },
                        title: element.name,
                        description: descCategory,
                        icon: 'utility:food_and_drink',
                        mapIcon: {
                            path: "M40.8813782,24 C39.9367714,31.8648614 33.526454,37 28,37 L16.0015898,37 C10.0054932,37 3.00158983,31.010376 3.00158983,22 C3.00158983,17.3333333 3.00158983,12.6666667 3.00158983,8 L3.00158983,8 C3.00158983,6.8954305 3.89702033,6 5.00158983,6 L5.00158983,6 L39,6 L44,6 C47.3137085,6 50,8.6862915 50,12 L50,18 C50,21.3137085 47.3137085,24 44,24 L40.8813782,24 Z M39,6 L39,6 Z M40.5925926,40 C41.3333333,40 42,40.675 42,41.425 L42,41.5 C42,43.975 40,46 37.5555556,46 L6.44444444,46 C4,46 2,43.975 2,41.5 L2,41.425 C2,40.675 2.66666667,40 3.40740741,40 L40.5925926,40 Z M41,11 L41,19 L43,19 C44.1045695,19 45,18.1045695 45,17 L45,13 C45,11.8954305 44.1045695,11 43,11 L41,11 Z",
                            fillColor: '#FF0000',
                            fillOpacity: 1,
                            scale: 0.4
                        }
                        
                    }
                    this.mapMarkers = [...this.mapMarkers, newMapMarker];
                   // zoomLevel=50
                });
            })
            .catch(error => {
                console.log('error: ', error);
            });
    }

}

