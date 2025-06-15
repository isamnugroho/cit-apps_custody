/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { NavigationExtras } from '@angular/router';
declare var google: any;

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  loader: boolean = false
  constructor(
    public util: UtilService,
    private modalController: ModalController
  ) {
    setTimeout(() => {
      this.loader = true;
      setTimeout(() => {
        this.getULocation();
      }, 1000);
    }, 2000);
  }

  ngOnInit() {
  }

  getULocation() {
    let map: { mapTypes: { set: (arg0: string, arg1: any) => void; }; setMapTypeId: (arg0: string) => void; };
    const markersOnMap = [
      {
        placeName: 'Richard G. Oneal',
        cover: 'assets/images/avatar/1.jpg',
        LatLng: [
          {
            lat: 21.598050,
            lng: 71.935396
          }
        ]
      },
      {
        placeName: 'Floyd M. Helton',
        cover: 'assets/images/avatar/2.jpg',
        LatLng: [
          {
            lat: 21.573454,
            lng: 71.729776,
          }
        ]
      },
      {
        placeName: 'Matthew M. Hernandez',
        cover: 'assets/images/avatar/3.jpg',
        LatLng: [
          {
            lat: 21.716109,
            lng: 71.868795
          }
        ]
      },
      {
        placeName: 'Candice M. Coffey',
        cover: 'assets/images/avatar/4.jpg',
        LatLng: [
          {
            lat: 21.580185,
            lng: 71.783582
          }
        ]
      },
      {
        placeName: 'Terrie R. Cobb',
        cover: 'assets/images/avatar/5.jpg',
        LatLng: [
          {
            lat: 21.5700318,
            lng: 71.8721725
          }
        ]
      },
    ];

    var InforObj: any[] = [];
    var centerCords = {
      lat: 21.5346,
      lng: 71.8275
    };
    initMap();
    let dummyThis = this;
    function addMarker() {
      for (var i = 0; i < markersOnMap.length; i++) {
        var contentString = '<div id="content"><h1>' + markersOnMap[i].placeName +
          '</h1></div>';
        const icon = {
          url: markersOnMap[i].cover,
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
        console.log(markersOnMap[i].LatLng[0]);
        const marker = new google.maps.Marker({
          position: markersOnMap[i].LatLng[0],
          map: map,
          animation: google.maps.Animation.DROP,
          icon: icon,
        });

        const infowindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 200
        });

        marker.addListener('click', function () {
          closeOtherInfo();
          infowindow.open(marker.get('map'), marker);
          InforObj[0] = infowindow;
          console.log(InforObj[0]);
          const cleanText = InforObj[0].content.replace(/<\/?[^>]+(>|$)/g, "");
          // console.log(cleanText);
          dummyThis.getName(cleanText);
        });

      }

      const userIcon = {
        url: 'assets/images/avatar/2.jpg',
        scaledSize: new google.maps.Size(40, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      }

      const marker = new google.maps.Marker({
        position: centerCords,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: userIcon,
      });
    }

    function closeOtherInfo() {
      if (InforObj.length > 0) {
        InforObj[0].set("marker", null);
        InforObj[0].close();
        InforObj.length = 0;
      }
    }

    function initMap() {
      var style = [
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [
            { saturation: -100 }
          ]
        }
      ];

      var mapOptions = {
        zoom: 10,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: false,
        overviewMapControl: false,
        center: centerCords,
        mapTypeControl: false,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'nepate']
        },
        disableDefaultUI: true
      }

      map = new google.maps.Map(document.getElementById('map'), mapOptions);
      var mapType = new google.maps.StyledMapType(style, { name: 'Grayscale' });
      const cityCircle = new google.maps.Circle({
        strokeColor: "#F89C02",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#F89C02",
        fillOpacity: 0.35,
        map,
        center: centerCords,
        radius: Math.sqrt(50000) * 100,
      });
      map.mapTypes.set('nepate', mapType);
      map.setMapTypeId('nepate');
      addMarker();
    }

  }

  async getName(name: string) {
    console.log('got name', name);
    const index = Math.floor(Math.random() * (this.util.salonList.length - 1 + 1)) + 1;
    console.log(index);
    const param: NavigationExtras = {
      queryParams: {
        id: index
      }
    };
    this.util.navigateToPage('salon-info', param);
  }

}
