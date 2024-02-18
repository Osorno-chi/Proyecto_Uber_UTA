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
  geocoder: any = null; //Inicializa geocoder como null
  service: any = null;
  currentPositionMarker: any; // Marcador para la ubicación actual
  address = new FormControl('');
  destination: any;
  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  //Función para inicializar el mapa
  initMap() {
    const mapEle = document.getElementById('map');
    this.geocoder = new google.maps.Geocoder();
    const myLatLng = { lat: 21.8841903, lng: -102.2947834 };  // Centar en Ags. si no da permiso de ubicación
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });

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
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // Crea un marcador en la ubicación actual
        this.currentPositionMarker = new google.maps.Marker({
          position: pos,
          map: this.map,
          title: 'Tu ubicación'
        });
        // Centra el mapa en la ubicación actual
        this.map.setCenter(pos);
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

  getDestination() {
    console.log(this.address.value);
    const request = {
      query: this.address.value || 'UTA',
      fields: ["name", "geometry"],
    };
    this.service = new google.maps.places.PlacesService(this.map);
    this.service.findPlaceFromQuery(request, (results: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          this.createMarker(results[i]);
        }
      }
    });
  }

  createMarker(place: any) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location,
    });
  }
}
