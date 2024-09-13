import { Component, AfterViewInit } from '@angular/core';
import { tileLayer, latLng, marker, Marker, icon, Map } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  address: string = '';
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap contributors' })
    ],
    zoom: 12,
    center: latLng(37.7749, -122.4194)
  };
  layers: Marker<any>[] = [];
  private map: Map;

  ngAfterViewInit() {
    this.map = new Map('map').setView(this.options.center, this.options.zoom);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Listen for the moveend event
    this.map.on('moveend', () => {
      const center = this.map.getCenter();
      this.options.center = latLng(center.lat, center.lng);
      this.options.zoom = this.map.getZoom();
      console.log('Map moved to center:', this.options.center, 'with zoom:', this.options.zoom);
    });
  }

  searchAddress() {
    if (!this.address) return;

    console.log('Searching for address:', this.address);

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${this.address}`)
      .then(response => response.json())
      .then(data => {
        console.log('Search results:', data);
        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);
          this.updateMap(lat, lon);
        } else {
          alert('Address not found');
        }
      })
      .catch(error => {
        console.error('Error fetching address:', error);
        alert('Error fetching address');
      });
  }

  updateMap(lat: number, lon: number) {
    const newCenter = latLng(lat, lon);
    this.map.setView(newCenter, 15); // Directly update the map center and zoom
    this.layers = [marker([lat, lon], {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/images/marker-icon.png',
        iconRetinaUrl: 'assets/images/marker-icon-2x.png',
        shadowUrl: 'assets/images/marker-shadow.png'
      })
    })];
    console.log('Map updated to center:', newCenter);
  }
}