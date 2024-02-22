import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

declare var google: any;

@Component({
  selector: 'app-gps',
  templateUrl: './gps.page.html',
  styleUrls: ['./gps.page.scss'],
})
export class GpsPage implements OnInit {
  map: any = null; // Inicializa map como null
  service: any = null;
  currentPositionMarker: any; // Marcador para la ubicación actual
  address: any = new FormControl('');
  autocomplete: any = null;
  destination: any = null;
  directionsService: any = null;
  directionsRenderer: any = null;
  pos: any = null;


  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  //Función para inicializar el mapa
  async initMap() {

    const { AdvancedMarkerElement } = google.maps.importLibrary("marker");
    const mapEle = document.getElementById('map');
    this.destination = document.getElementById('address');
    this.autocomplete = new google.maps.places.Autocomplete(this.destination,
      {
        componentRestrictions: { country: ["mx", "AG"] },
        fields: ["address_components", "geometry"],
        types: ["address"],
      });
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    const myLatLng = { lat: 21.8841903, lng: -102.2947834 };  // Centar en Ags. si no da permiso de ubicación
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12,
      mapId: "ffff0455",
    });
    this.directionsRenderer.setMap(this.map);
    this.address.value = this.destination.value;
    // Agrega un listener al evento 'idle'
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      // Ejecuta este código una vez que el mapa esté listo
      if (mapEle != null) {
        mapEle.classList.add('show-map');
      }
      this.getCurrentLocation(); // Llamar a la función de geolocalización
    });
  }

  //Función de geolocalización
  async getCurrentLocation() {

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // Crea un marcador en la ubicación actual
        this.currentPositionMarker = new AdvancedMarkerElement({
          position: this.pos,
          map: this.map,
          title: 'Tu ubicación'
        });
        // Centra el mapa en la ubicación actual
        this.map.setCenter(this.pos);
      }, () => {
        this.handleLocationError(true);
      });
    } else {
      // El navegador no soporta la geolocalización
      this.handleLocationError(false);
    }
  }

  handleLocationError(browserHasGeolocation: boolean) {
    console.error(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
  }

  async getDestination() {

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    console.log(this.address.value);
    const request = {
      query: this.address.value,
      fields: ["name", "geometry"],
    };
    this.service = new google.maps.places.PlacesService(this.map);
    this.service.findPlaceFromQuery(request, (results: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        this.drawRoute(this.pos, results[0].geometry.location)
        const destino = new AdvancedMarkerElement({
          position: results[0].geometry.location,
          map: this.map,
          title: results[0].name
        });
      }
    });
  }

  drawRoute(origin: any, destination: any) {
    this.directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    })
      .then((response: any) => {
        this.directionsRenderer.setDirections(response);
      })
      .catch((e: any) => window.alert(`Directions request failed due to ${e}`));
  }
}