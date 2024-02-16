import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-gps',
  templateUrl: './gps.page.html',
  styleUrls: ['./gps.page.scss'],
})
export class GpsPage implements OnInit {
  map: any = null; // Inicializa map como null
  currentPositionMarker: any; // Marcador para la ubicación actual

  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    const mapEle = document.getElementById('map');
    const myLatLng = { lat: 21.8841903, lng: -102.2947834 };
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
      this.getCurrentLocation();
    });
  }

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
}
